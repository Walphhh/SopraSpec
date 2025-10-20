import { Request, Response } from "express";
import supabase from "../config/supabase-client";
import { getStatusMessage, Status } from "@src/utils/status-codes";

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
          created_at
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return res.status(Status.SUCCESS).json({
        message: "System stack retrieved successfully",
        data,
      });
    } catch (error: any) {
      return res.status(Status.BAD_REQUEST).json({
        error: error.message || getStatusMessage(Status.INTERNAL_SERVER_ERROR),
      });
    }
  },

  /**
   * Get system recommendations based on selections
   */
  getRecommendedSystems: async (req: Request, res: Response) => {
    const { distributor, selections } = req.body;

    if (!distributor || !selections) {
      return res
        .status(Status.BAD_REQUEST)
        .json({ error: "Distributor and selections are required" });
    }

    try {
      let query = supabase
        .from("system_stack")
        .select("*")
        .eq("distributor", distributor);

      // Apply filters dynamically
      const filters = [
        "area_type",
        "substrate",
        "material",
        "insulated",
        "exposure",
        "attachment",
        "roof_subtype",
        "foundation_subtype",
        "civil_work_subtype",
      ];

      for (const key of filters) {
        if (selections[key] !== undefined && selections[key] !== null) {
          query = query.eq(key, selections[key]);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data?.length) {
        return res.status(Status.NOT_FOUND).json({
          message: "No matching systems found for the given selections.",
          data: { selections, recommendedSystems: [], count: 0 },
        });
      }

      return res.status(Status.SUCCESS).json({
        message: "Recommended systems found.",
        data: { selections, recommendedSystems: data, count: data.length },
      });
    } catch (error: any) {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },

  /**
   * Get available options for each selection step dynamically
   */
  getSelectionOptions: async (req: Request, res: Response) => {
    const { distributor, area_type } = req.query;

    try {
      let query = supabase
        .from("system_stack")
        .select(
          "substrate, material, attachment, area_type, roof_subtype, foundation_subtype, civil_work_subtype"
        );

      if (distributor) query = query.eq("distributor", distributor);
      if (area_type) query = query.eq("area_type", area_type);

      const { data, error } = await query;
      if (error) throw error;

      const unique = (key: string) => [
        ...new Set(
          (data as Array<Record<string, any>>)
            .map((item) => item[key])
            .filter(Boolean)
        ),
      ];

      return res.status(Status.SUCCESS).json({
        message: "Selection options retrieved successfully",
        data: {
          distributor: distributor || "All",
          steps: {
            substrate: unique("substrate"),
            material: unique("material"),
            attachment: unique("attachment"),
            roof_subtype: unique("roof_subtype"),
            foundation_subtype: unique("foundation_subtype"),
            civil_work_subtype: unique("civil_work_subtype"),
          },
        },
      });
    } catch (error: any) {
      return res
        .status(Status.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  },
};

export default SystemStack;
