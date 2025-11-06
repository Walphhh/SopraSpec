"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchNextStep,
  recommendSystemStacks,
  fetchSystemStackById,
  type RecommendedSystemStackSummary,
  type SystemStackDetails,
  fetchSystemStackLayers,
  type SystemStackCombination,
} from "@/lib/api/system-stacks";
import { useAuth } from "@/utils/auth-provider";

// Ordered fields for breadcrumb display
const ORDER = [
  "area_type",
  "distributor",
  "roof_subtype",
  "foundation_subtype",
  "civil_work_subtype",
  "substrate",
  "material",
  "insulated",
  "exposure",
  "attachment",
] as const;

export function useSystemWizard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [options, setOptions] = useState<Array<{ value: any; label: string }>>(
    []
  );
  const [noResults, setNoResults] = useState(false);
  const [finished, setFinished] = useState(false);
  const [recommendations, setRecommendations] = useState<
    RecommendedSystemStackSummary[] | null
  >(null);
  const [details, setDetails] = useState<SystemStackDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [layerCombinations, setLayerCombinations] = useState<
    Record<string, SystemStackCombination[]>
  >({});

  // Initialise first step
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError(null);
      setNoResults(false);
      try {
        const res = await fetchNextStep({});
        if (ignore) return;
        setCurrentStep(res.next_step ?? null);
        setOptions(res.options ?? []);
      } catch (err: any) {
        if (ignore) return;
        if (err?.response?.status === 404) {
          setNoResults(true);
        } else {
          setError("Failed to load options");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const selections = filters; // alias for compatibility

  const setSelectionForActive = useCallback(
    async (value: any) => {
      if (!currentStep) return;
      const newFilters = { ...filters, [currentStep]: value };
      setFilters(newFilters);
      setLoading(true);
      setError(null);
      setNoResults(false);
      setDetails(null);
      try {
        const res = await fetchNextStep(newFilters);
        const isComplete = res.complete === true;
        if (isComplete || !res.next_step || (res.options && res.options.length === 0)) {
          // Either all filters complete or no next options
          if (!user?.id) {
            setError("Login required to generate recommendations");
            setLoading(false);
            return;
          }
          const recs = await recommendSystemStacks(newFilters);
          if (!recs || recs.length === 0) {
            setNoResults(true);
            setRecommendations([]);
            setFinished(false);
            // Keep the current step visible so the no-results message shows
            setCurrentStep(currentStep);
          } else {
            setRecommendations(recs);
            setLayerCombinations((prev) => {
              const next = { ...prev };
              for (const rec of recs) {
                if (next[rec.id] !== undefined) {
                  delete next[rec.id];
                }
              }
              return next;
            });
            try {
              const combos = await Promise.all(
                recs.map(async (rec) => {
                  try {
                    const layers = await fetchSystemStackLayers(rec.id);
                    return [rec.id, layers.combinations] as [
                      string,
                      SystemStackCombination[]
                    ];
                  } catch {
                    return [rec.id, [] as SystemStackCombination[]] as [
                      string,
                      SystemStackCombination[]
                    ];
                  }
                })
              );
              setLayerCombinations((prev) => {
                const next = { ...prev };
                for (const [systemId, combo] of combos) {
                  next[systemId] = combo;
                }
                return next;
              });
            } catch {
              // swallow combination hydration errors; UI will handle missing data
            }
            setFinished(true);
          }
          setOptions([]);
        } else {
          setCurrentStep(res.next_step);
          setOptions(res.options ?? []);
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNoResults(true);
          setOptions([]);
          // Keep current step so the message renders
          setCurrentStep(currentStep);
        } else {
          setError("Failed to load options");
        }
      } finally {
        setLoading(false);
      }
    },
    [currentStep, filters, user?.id]
  );

  const back = useCallback(() => {
    // Simple back: remove last set field in ORDER
    const lastKey = [...ORDER]
      .reverse()
      .find((k) => filters[k as string] !== undefined);
    if (!lastKey) return;
    const newFilters = { ...filters } as Record<string, any>;
    delete newFilters[lastKey as string];
    setFilters(newFilters);
    // Re-fetch step for the new filter set
    (async () => {
      setLoading(true);
      setError(null);
      setNoResults(false);
      setFinished(false);
      setRecommendations(null);
      setLayerCombinations({});
      try {
        const res = await fetchNextStep(newFilters);
        setCurrentStep(res.next_step ?? null);
        setOptions(res.options ?? []);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNoResults(true);
          setCurrentStep(null);
          setOptions([]);
        } else {
          setError("Failed to load options");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  const loadDetails = useCallback(async (id: string) => {
    setDetails(null);
    setDetailsLoading(true);
    setError(null);
    setLayerCombinations((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) delete next[id];
      return next;
    });
    try {
      const d = await fetchSystemStackById(id);
      setDetails(d);
      try {
        const layers = await fetchSystemStackLayers(id);
        setLayerCombinations((prev) => ({
          ...prev,
          [id]: layers.combinations,
        }));
      } catch {
        // ignore combination fetch errors in detail view
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load system details");
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const orderedKeys = useMemo<string[]>(() => [...ORDER], []);

  return {
    // state
    loading,
    error,
    currentStep,
    options,
    selections,
    noResults,
    finished,
    recommendations,
    details,
    detailsLoading,
    layerCombinations,
    orderedKeys,
    // actions
    setSelectionForActive,
    back,
    loadDetails,
  } as const;
}


