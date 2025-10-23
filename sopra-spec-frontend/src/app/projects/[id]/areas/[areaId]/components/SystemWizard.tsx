"use client";

import { useEffect, useMemo, useState } from "react";
import OptionCard from "@/components/OptionCard";
import {
  fetchSelectionOptions,
  recommendSystemStacks,
  fetchSystemStackById,
  type SelectionSteps,
  type SelectionValue,
  type RecommendSelections,
  type RecommendedSystemStackSummary,
  type SystemStackDetails,
} from "@/lib/api/system-stacks";
import { useAuth } from "@/utils/auth-provider";

export default function SystemWizard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<SelectionSteps | null>(null);
  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState<RecommendSelections>({});
  const [recommendations, setRecommendations] = useState<
    RecommendedSystemStackSummary[] | null
  >(null);
  const [details, setDetails] = useState<SystemStackDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    fetchSelectionOptions()
      .then((res) => {
        if (!ignore) setSteps(res);
      })
      .catch(
        (err) => !ignore && setError(err?.message ?? "Failed to load options")
      )
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const orderedKeys = useMemo(() => {
    if (!steps) return [] as string[];
    const preferred = [
      "substrate",
      "material",
      "insulated",
      "exposure",
      "attachment",
    ];
    const available = Object.keys(steps);
    const inOrder = preferred.filter((k) => available.includes(k));
    const remaining = available.filter((k) => !inOrder.includes(k));
    return [...inOrder, ...remaining];
  }, [steps]);

  const activeKey = orderedKeys[current];
  const active = activeKey ? steps?.[activeKey] : undefined;

  const canGoBack = current > 0;
  const isLast = orderedKeys.length > 0 && current === orderedKeys.length - 1;

  function selectOption(value: SelectionValue) {
    const key = activeKey as keyof RecommendSelections;
    setSelections((prev) => ({ ...prev, [key]: value }));
    if (!isLast) {
      setCurrent((c) => c + 1);
    }
  }

  async function getRecommendations() {
    if (!user?.id) {
      setError("You must be logged in to get recommendations");
      return;
    }
    setLoading(true);
    setError(null);
    setRecommendations(null);
    setDetails(null);
    try {
      const list = await recommendSystemStacks(selections as any);
      setRecommendations(list);
    } catch (e: any) {
      setError(e?.message ?? "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  }

  async function viewDetails(id: string) {
    setDetails(null);
    setDetailsLoading(true);
    try {
      const d = await fetchSystemStackById(id);
      setDetails(d);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load system stack details");
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-semibold text-[#0072CE]">System Selection</h3>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {loading && !steps && (
        <div className="text-[#7C878E]">Loading options…</div>
      )}

      {steps && !recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#7C878E]">
                Step {current + 1} of {orderedKeys.length}
              </div>
              <div className="text-lg text-[#1E293B] font-medium">
                {active?.title ?? activeKey}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded border border-[#B3C7D6] px-3 py-1 text-[#1E293B] disabled:opacity-50"
                disabled={!canGoBack}
                onClick={() =>
                  canGoBack && setCurrent((c) => Math.max(0, c - 1))
                }
              >
                Back
              </button>
              {isLast && (
                <button
                  className="rounded bg-[#0072CE] text-white px-4 py-1 hover:bg-[#005a9e] disabled:opacity-50"
                  onClick={getRecommendations}
                  disabled={loading}
                >
                  {loading ? "Loading…" : "Get Recommendations"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active?.options?.map((opt, idx) => (
              <OptionCard
                key={`${activeKey}-${idx}`}
                title={String(opt.label ?? opt.value)}
                textOnly
                width={320}
                onClick={() => selectOption(opt.value)}
                selected={
                  String(selections[activeKey as keyof RecommendSelections]) ===
                  String(opt.value)
                }
              />
            ))}
          </div>
        </div>
      )}

      {recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg text-[#1E293B] font-medium">
              Recommended Systems ({recommendations.length})
            </div>
            <button
              className="rounded border border-[#B3C7D6] px-3 py-1 text-[#1E293B]"
              onClick={() => {
                setRecommendations(null);
                setDetails(null);
              }}
            >
              Modify Selection
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded border border-[#E2E8F0] p-4 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[#0072CE] font-semibold">
                      System #{rec.id}
                    </div>
                    <div className="text-sm text-[#475569]">
                      {rec.substrate && (
                        <span className="mr-3">Substrate: {rec.substrate}</span>
                      )}
                      {rec.material && (
                        <span className="mr-3">Material: {rec.material}</span>
                      )}
                      {typeof rec.insulated === "boolean" && (
                        <span className="mr-3">
                          {rec.insulated ? "Insulated" : "Non-insulated"}
                        </span>
                      )}
                      {typeof rec.exposure === "boolean" && (
                        <span className="mr-3">
                          {rec.exposure ? "Exposed" : "Protected"}
                        </span>
                      )}
                      {rec.attachment && (
                        <span className="mr-3">
                          Attachment: {rec.attachment}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded bg-[#0072CE] text-white px-3 py-1 hover:bg-[#005a9e]"
                      onClick={() => viewDetails(rec.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            {detailsLoading && (
              <div className="text-[#7C878E] mt-2">Loading details…</div>
            )}
            {details && (
              <div className="mt-4 rounded border border-[#E2E8F0] bg-white p-4">
                <div className="text-[#1E293B] font-semibold mb-2">
                  System Stack Details
                </div>
                <div className="text-sm text-[#475569] mb-3">
                  {details.substrate && (
                    <span className="mr-3">Substrate: {details.substrate}</span>
                  )}
                  {details.material && (
                    <span className="mr-3">Material: {details.material}</span>
                  )}
                  {typeof details.insulated === "boolean" && (
                    <span className="mr-3">
                      {details.insulated ? "Insulated" : "Non-insulated"}
                    </span>
                  )}
                  {typeof details.exposure === "boolean" && (
                    <span className="mr-3">
                      {details.exposure ? "Exposed" : "Protected"}
                    </span>
                  )}
                  {details.attachment && (
                    <span className="mr-3">
                      Attachment: {details.attachment}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {details.system_stack_layer?.map((layer, idx) => (
                    <div
                      key={idx}
                      className="rounded border border-[#E2E8F0] p-3"
                    >
                      <div className="text-[#0072CE] font-medium">
                        {layer.product.layer
                          ? `${layer.product.layer}`
                          : `Layer ${idx + 1}`}
                      </div>
                      <div className="text-[#1E293B]">{layer.product.name}</div>
                      {layer.product.distributor && (
                        <div className="text-sm text-[#475569]">
                          Distributor:{" "}
                          {layer.product.distributor}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
