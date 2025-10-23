import axios from "axios";
import { getBackendUrl } from "@/utils/get-backend-url";

export type SelectionValue = string | number | boolean;
export type SelectionOption = { value: SelectionValue; label: string };

// Old wizard types (kept for compatibility)
export type SelectionSteps = Record<string, { title?: string; options: SelectionOption[] }>;
export type RecommendSelections = Record<string, SelectionValue>;

// New wizard types
export type NextStepPayload = { filters?: Record<string, unknown> };
export type NextStepData = { next_step: string | null; options: SelectionOption[]; complete?: boolean };

export type RecommendedSystemStackSummary = {
  id: string;
  distributor?: string;
  area_type?: string;
  substrate?: string | null;
  material?: string | null;
  insulated?: boolean | null;
  exposure?: boolean | null;
  attachment?: string | null;
};

export type SystemStackDetails = RecommendedSystemStackSummary & {
  created_at?: string;
  // Optional layers structure for details view
  system_stack_layer?: Array<{
    product: {
      layer?: string | null;
      name: string;
      distributor?: string | null;
    };
  }>;
};

export type SystemStackLayerProduct = {
  id: string | null;
  name: string;
  layer?: string | null;
  distributor?: string | null;
};

export type SystemStackCombination = {
  combination: number;
  products: SystemStackLayerProduct[];
};

export type SystemStackLayers = {
  systemStackId: string;
  combinations: SystemStackCombination[];
};

// Helper to include bearer token if present
function authHeaders() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  } catch {
    return undefined;
  }
}

// New wizard: dynamic next-step options
export async function fetchNextStep(filters: Record<string, unknown>) {
  const url = getBackendUrl(`/system-stacks/options`);
  const payload: NextStepPayload = { filters };
  const { data } = await axios.post(url, payload, { headers: authHeaders() });
  const res: NextStepData = data?.data ?? { next_step: null, options: [] };
  return res;
}

// New + old wizard: recommend systems
export async function recommendSystemStacks(
  selections: Record<string, SelectionValue>
): Promise<RecommendedSystemStackSummary[]> {
  const url = getBackendUrl(`/system-stacks/recommend`);
  // Backend expects { distributor, selections }
  const distributor = (selections as any)?.distributor;
  const { data } = await axios.post(
    url,
    { distributor, selections },
    { headers: authHeaders() }
  );
  const rows: unknown[] = data?.data ?? data?.systems ?? [];
  return rows
    .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object")
    .map((row) => ({
      id: String(row.id ?? ""),
      distributor: String(row.distributor ?? ""),
      area_type: String(row.area_type ?? ""),
      substrate: (row as any).substrate ?? null,
      material: (row as any).material ?? null,
      insulated: (row as any).insulated ?? null,
      exposure: (row as any).exposure ?? null,
      attachment: (row as any).attachment ?? null,
    }))
    .filter((r) => r.id.length > 0);
}

// New + old wizard: fetch details by ID
export async function fetchSystemStackById(id: string): Promise<SystemStackDetails> {
  const url = getBackendUrl(`/system-stacks/${encodeURIComponent(id)}`);
  const { data } = await axios.get(url, { headers: authHeaders() });
  const d = (data?.data ?? data?.system_stack ?? {}) as Record<string, unknown>;
  return {
    id: String(d.id ?? id),
    distributor: d.distributor as string | undefined,
    area_type: d.area_type as string | undefined,
    substrate: (d as any).substrate ?? null,
    material: (d as any).material ?? null,
    insulated: (d as any).insulated ?? null,
    exposure: (d as any).exposure ?? null,
    attachment: (d as any).attachment ?? null,
    created_at: d.created_at as string | undefined,
    system_stack_layer: (d as any).system_stack_layer,
  };
}

export async function fetchSystemStackLayers(id: string): Promise<SystemStackLayers> {
  const url = getBackendUrl(`/system-stacks/${encodeURIComponent(id)}/layers`);
  const { data } = await axios.get(url, { headers: authHeaders() });
  const payload = (data?.data ?? {}) as Record<string, unknown>;
  const rawCombinations = Array.isArray(payload.combinations) ? payload.combinations : [];

  const combinations: SystemStackCombination[] = rawCombinations
    .map((combo: any) => {
      const combinationNumber =
        typeof combo?.combination === "number"
          ? combo.combination
          : Number(combo?.combination) || 1;
      const rawProducts = Array.isArray(combo?.products) ? combo.products : [];
      const products: SystemStackLayerProduct[] = rawProducts
        .filter(
          (p: any): p is { id?: string | number | null; name: string } =>
            Boolean(p) && typeof p.name === "string"
        )
        .map((product) => {
          const idValue =
            product.id === null || product.id === undefined
              ? null
              : String(product.id);
          const layerValue =
            typeof product.layer === "string" && product.layer.trim().length > 0
              ? product.layer.trim()
              : null;
          const distributorValue =
            typeof product.distributor === "string" && product.distributor.trim().length > 0
              ? product.distributor.trim()
              : null;

          return {
            id: idValue,
            name: product.name.trim(),
            layer: layerValue,
            distributor: distributorValue,
          };
        });

      return { combination: combinationNumber, products };
    })
    .sort((a, b) => a.combination - b.combination);

  return {
    systemStackId: String(payload.system_stack_id ?? id),
    combinations,
  };
}

// Old wizard: initial selection steps (basic shim)
// Returns a minimal structure so the legacy component renders without crashing.
export async function fetchSelectionOptions(): Promise<SelectionSteps> {
  // Try to fetch the first dynamic step and present it as a single-step map.
  try {
    const { next_step, options } = await fetchNextStep({});
    if (!next_step) return {};
    return { [next_step]: { title: undefined, options } };
  } catch {
    return {};
  }
}
