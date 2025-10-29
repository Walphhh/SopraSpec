import { Request, Response } from "express";
import supabase from "../config/supabase-client";
import { getStatusMessage, Status } from "@src/utils/status-codes";
import { PDFGeneratorService } from '../services/pdf-gen-service';


const ORDER = [
  "distributor",
  "area_type",
  "roof_subtype",
  "foundation_subtype",
  "civil_work_subtype",
  "substrate",
  "material",
  "insulated",
  "exposure",
  "attachment",
] as const;

type SelectionFilters = Record<string, unknown>;

const formatLabel = (val: unknown) => {
  if (typeof val === "string") {
    const withSpaces = val.replace(/_/g, " ");
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (val === null || val === undefined) return "Unknown";
  return String(val);
};

const formatTitle = (field: string) =>
  formatLabel(field).replace(/\bId\b/i, "ID");

const buildEffectiveOrder = (areaType?: string) => {
  const normalised = String(areaType ?? "").toLowerCase();
  const isRoof = normalised === "roof";
  const isFoundation = normalised === "foundation";
  const isCivil = normalised === "civil_work";

  return ORDER.filter((field) => {
    if (field === "roof_subtype") return isRoof;
    if (field === "foundation_subtype") return isFoundation;
    if (field === "civil_work_subtype") return isCivil;
    return true;
  });
};

const sanitiseFilters = (raw: SelectionFilters, allowed: readonly string[]) => {
  const filters: SelectionFilters = {};
  for (const key of Object.keys(raw)) {
    if (!allowed.includes(key)) continue;
    const value = raw[key];
    if (value === undefined || value === null || value === "") continue;
    filters[key] = value;
  }
  return filters;
};

const collectDistinctOptions = async (
  column: string,
  filters: SelectionFilters
) => {
  const { data, error } = await supabase
    .from("system_stack")
    .select(column)
    .match(filters)
    .not(column, "is", null);

  if (error) throw error;

  const values = Array.isArray(data)
    ? Array.from(
        new Set(
          data
            .map((row: any) => row?.[column])
            .filter((value) => value !== null && value !== undefined)
        )
      )
    : [];

  return values.map((value) => ({ value, label: formatLabel(value) }));
};

const SystemStack = {
  /**
   * Get specific system stack by ID
   */
  getSystemStackById: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from("system_stack")
        .select(
          `
          id,
          distributor,
          area_type,
          substrate,
          material,
          insulated,
          exposure,
          attachment,
          roof_subtype,
          foundation_subtype,
          civil_work_subtype,
          created_at,
          system_stack_layer:system_stack_layer(
            combination,
            product:product_id(
              id,
              name,
              layer,
              distributor
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        return res.status(Status.BAD_REQUEST).json({
          error: error.message || getStatusMessage(Status.BAD_REQUEST),
        });
      }

      return res.status(Status.SUCCESS).json({
        message: "System stack retrieved successfully",
        data,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },

  /**
   * Get system recommendations based on selections
   */
  getRecommendedSystems: async (req: Request, res: Response) => {
    const { distributor, selections } = req.body as {
      distributor?: string;
      selections?: SelectionFilters;
    };

    if (!distributor || !selections) {
      return res.status(Status.BAD_REQUEST).json({
        error: "Distributor and selections are required",
      });
    }

    try {
      const enumFields = [
        "distributor",
        "area_type",
        "substrate",
        "material",
        "attachment",
        "roof_subtype",
        "foundation_subtype",
        "civil_work_subtype",
      ];

      const filters: SelectionFilters = {
        ...selections,
        distributor,
      };

      const query = applyEnumSafeFilters(
        supabase.from("system_stack").select(
          `
            id,
            distributor,
            area_type,
            substrate,
            material,
            insulated,
            exposure,
            attachment,
            roof_subtype,
            foundation_subtype,
            civil_work_subtype
          `
        ),
        filters,
        enumFields
      ).limit(50);

      const { data, error } = await query;
      if (error) throw error;

      return res.status(Status.SUCCESS).json({
        message: "Recommended systems retrieved successfully",
        data: data ?? [],
      });
    } catch (error: any) {
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: error.message || getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },
  /**
   * Get available options for each selection step dynamically
   */
  getSelectionOptions: async (req: Request, res: Response) => {
    const { distributor, area_type } = req.query;

    try {
      const effectiveOrder = buildEffectiveOrder(
        typeof area_type === "string" ? area_type : undefined
      );

      const baseFilters: SelectionFilters = {};
      if (typeof distributor === "string" && distributor) {
        baseFilters.distributor = distributor;
      }
      if (typeof area_type === "string" && area_type) {
        baseFilters.area_type = area_type;
      }

      const data: Record<
        string,
        { title?: string; options: Array<{ value: unknown; label: string }> }
      > = {};

      for (const field of effectiveOrder) {
        const options = await collectDistinctOptions(field, baseFilters);
        if (options.length > 0) {
          data[field] = { title: formatTitle(field), options };
        }
      }

      return res.status(Status.SUCCESS).json({
        message: "Selection options retrieved successfully",
        data,
      });
    } catch (error: any) {
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: error.message || getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },

  /**
   * Dynamically compute next-step options based on current filters
   * Ordered logic determines the next field; skips irrelevant subtype fields.
   * Body: { filters: Record<string, unknown> }
   */
  getDynamicSelectionOptions: async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as { filters?: SelectionFilters };
    const rawFilters = body.filters ?? {};

    const areaType =
      typeof rawFilters["area_type"] === "string"
        ? (rawFilters["area_type"] as string)
        : undefined;
    const effectiveOrder = buildEffectiveOrder(areaType);
    const filters = sanitiseFilters(rawFilters, effectiveOrder);

    const remaining = effectiveOrder.filter((field) => !(field in filters));

    if (remaining.length === 0) {
      return res.status(Status.SUCCESS).json({
        message: "All filters complete",
        data: { next_step: null, options: [], complete: true },
      });
    }

    try {
      for (const field of remaining) {
        const options = await collectDistinctOptions(field, filters);
        if (options.length > 0) {
          return res.status(Status.SUCCESS).json({
            message: "Next-step options retrieved successfully",
            data: { next_step: field, options, complete: false },
          });
        }
      }

      return res.status(Status.SUCCESS).json({
        message: "All filters complete",
        data: { next_step: null, options: [], complete: true },
      });
    } catch (error: any) {
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: error.message || getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },

  /**
   * Get all product combinations (layers) for a specific system stack
   */
  getSystemStackLayers: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Missing system_stack_id parameter" });
    }

    try {
      type LayerRow = {
        system_stack_id: string;
        combination: number | string | null;
        product: {
          id: string | number | null;
          name: string | null;
          layer?: string | null;
          distributor?: string | null;
        } | null;
      };

      type LayerCombination = {
        combination: number;
        products: Array<{
          id: string | null;
          name: string;
          layer: string | null;
          distributor: string | null;
        }>;
      };

      const { data, error } = await supabase
        .from("system_stack_layer")
        .select(
          `
        system_stack_id,
        combination,
        product:product_id(
          id,
          name,
          layer,
          distributor
        )
      `
        )
        .eq("system_stack_id", id)
        .order("combination", { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.status(Status.NOT_FOUND).json({
          message: "No layers found for this system stack",
          data: {
            system_stack_id: id,
            combinations: [],
          },
          meta: { combination_count: 0, product_count: 0 },
        });
      }

      const combinationsMap = new Map<number, LayerCombination>();

      const rows = Array.isArray(data)
        ? (data as unknown as Array<Partial<LayerRow>>)
        : [];

      for (const rawRow of rows) {
        if (!rawRow) continue;

        const combinationNumber =
          typeof rawRow.combination === "number"
            ? rawRow.combination
            : Number(rawRow.combination ?? 1) || 1;

        if (!combinationsMap.has(combinationNumber)) {
          combinationsMap.set(combinationNumber, {
            combination: combinationNumber,
            products: [],
          });
        }

        const product = rawRow.product ?? null;
        const productName =
          product && typeof product.name === "string" ? product.name : null;
        if (!productName) continue;

        const trimmedName = productName.trim();
        if (trimmedName.length === 0) continue;

        const productId =
          product?.id !== null && product?.id !== undefined
            ? String(product.id)
            : null;

        const layerValue =
          product && typeof product.layer === "string"
            ? product.layer.trim() || null
            : null;

        const distributorValue =
          product && typeof product.distributor === "string"
            ? product.distributor.trim() || null
            : null;

        combinationsMap.get(combinationNumber)?.products.push({
          id: productId,
          name: trimmedName,
          layer: layerValue,
          distributor: distributorValue,
        });
      }

      const combinations = Array.from(combinationsMap.values())
        .map((combo) => ({
          ...combo,
          products: combo.products,
        }))
        .sort((a, b) => a.combination - b.combination);

      const meta = combinations.reduce(
        (acc, combo) => {
          acc.product_count += combo.products.length;
          return acc;
        },
        { combination_count: combinations.length, product_count: 0 }
      );

      return res.status(Status.SUCCESS).json({
        message: "System stack combinations retrieved successfully",
        data: {
          system_stack_id: id,
          combinations,
        },
        meta,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: error.message || getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },
    /**
   * Generate PDF specification for a system stack
   */
  generateSystemPDF: async (req: Request, res: Response) => {
    const { id } = req.params;
    const projectInfo = req.body || {};

    try {
      // Fetch system stack with all layers
      const { data: systemStack, error } = await supabase
        .from('system_stack')
        .select(
          `
          id,
          distributor,
          area_type,
          substrate,
          material,
          insulated,
          exposure,
          attachment,
          roof_subtype,
          foundation_subtype,
          civil_work_subtype,
          system_stack_layer:system_stack_layer(
            combination,
            product:product_id(
              id,
              name,
              layer,
              distributor
            )
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        return res.status(Status.BAD_REQUEST).json({
          error: error.message || getStatusMessage(Status.BAD_REQUEST),
        });
      }

      if (!systemStack) {
        return res.status(Status.NOT_FOUND).json({
          error: 'System stack not found',
        });
      }

      // Transform the data to match SystemStackData interface
      const transformedSystemStack = {
        ...systemStack,
        system_stack_layer: systemStack.system_stack_layer?.map((layer: any) => ({
          combination: typeof layer.combination === 'number' ? layer.combination : Number(layer.combination) || 1,
          product: {
            id: String(layer.product?.id || ''),
            name: String(layer.product?.name || ''),
            layer: layer.product?.layer || undefined,
            distributor: layer.product?.distributor || undefined,
          }
        })) || []
      };

      // Generate PDF
      const pdfService = new PDFGeneratorService();
      await pdfService.generateSystemSpecification(
        transformedSystemStack,
        projectInfo,
        res
      );
    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      return res.status(Status.INTERNAL_SERVER_ERROR).json({
        error: error.message || getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },
};

// 🔹 Generic enum-safe filter helper
function applyEnumSafeFilters(
  query: any,
  selections: Record<string, any>,
  enumFields: string[]
) {
  for (const [key, value] of Object.entries(selections)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      // e.g. allow multiple materials: ['bitumen', 'synthetic']
      query = query.in(key, value);
    } else if (enumFields.includes(key)) {
      // enforce exact match for enums
      query = query.eq(key, value);
    } else {
      // non-enum fields (text, bool, numeric) can use ilike or eq
      if (typeof value === "string") {
        query = query.ilike(key, `%${value}%`);
      } else {
        query = query.eq(key, value);
      }
    }
  }
  return query;
}

export default SystemStack;
