"use client";

import OptionCard from "@/components/OptionCard";
import { useSystemWizard } from "@/lib/hooks/useSystemWizard";
import { Divide } from "lucide-react";

export default function SystemWizard({ projectId }: { projectId?: string }) {
  const wizard = useSystemWizard();

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-semibold text-[#0072CE]">System Selection</h3>

      {wizard.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {wizard.error}
        </div>
      )}

      {!wizard.currentStep && wizard.loading && (
        <div className="text-[#7C878E]">Loading options...</div>
      )}

      {wizard.currentStep && !wizard.finished && (
        <div className="space-y-4">
          <div className="flex items-center p-10 justify-between">
            <div>
              <div className="text-sm text-[#7C878E]">
                Current Step: {wizard.currentStep}
              </div>
              <div className="text-lg text-[#1E293B] font-medium">
                Select {wizard.currentStep.replace(/_/g, " ")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded border border-[#B3C7D6] px-3 py-1 text-[#1E293B]"
                onClick={wizard.back}
              >
                Back
              </button>
            </div>
          </div>

          <div
            className={`
    grid gap-4 justify-center place-items-center
    ${wizard.options.length === 1 ? "grid-cols-1" : ""}
    ${wizard.options.length === 2 ? "grid-cols-2" : ""}
    ${wizard.options.length >= 3 ? "grid-cols-3" : ""}
  `}
          >
            {wizard.options?.map((opt, idx) => (
              <OptionCard
                key={`${wizard.currentStep}-${idx}`}
                title={String(opt.label ?? opt.value)}
                textOnly
                width={320}
                onClick={() => wizard.setSelectionForActive(opt.value)}
                selected={
                  String(
                    wizard.selections[
                      wizard.currentStep as keyof typeof wizard.selections
                    ]
                  ) === String(opt.value)
                }
              />
            ))}
          </div>

          {(!wizard.options || wizard.options.length === 0) && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
              No options available for this step. Please check your database
              seed data for system_stack.
            </div>
          )}

          {wizard.noResults && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
              No matching systems found. Try a different selection.
            </div>
          )}
        </div>
      )}

      {wizard.finished && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-lg text-[#1E293B] font-medium">
              Recommended Systems ({wizard.recommendations?.length ?? 0})
            </div>
            <button
              className="rounded border border-[#B3C7D6] px-3 py-1 text-[#1E293B]"
              onClick={wizard.back}
            >
              Modify Selection
            </button>
          </div>

          <div className="flex justify-center gap-3">
            {wizard.recommendations?.map((rec) => (
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
                      onClick={() => wizard.loadDetails(rec.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {(() => {
                    const combinations = wizard.layerCombinations?.[rec.id];
                    if (combinations === undefined) {
                      return (
                        <div className="text-sm text-[#7C878E]">
                          Loading product layers...
                        </div>
                      );
                    }
                    if (combinations.length === 0) {
                      return (
                        <div className="text-sm text-[#7C878E]">
                          Product layers not available yet for this system.
                        </div>
                      );
                    }
                    return combinations.map((combo) => (
                      <div
                        key={`${rec.id}-combo-${combo.combination}`}
                        className="rounded border border-[#E2E8F0] p-3 bg-[#F8FAFC] space-y-3"
                      >
                        <div className="text-sm font-semibold text-[#1E293B]">
                          Combination {combo.combination}
                        </div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#475569]">
                          {combo.products.map((product, idx) => {
                            const label = product.layer
                              ? `${product.layer}: ${product.name}`
                              : product.name;
                            return (
                              <li
                                key={
                                  product.id ??
                                  `${rec.id}-${combo.combination}-${idx}`
                                }
                              >
                                {label}
                              </li>
                            );
                          })}
                        </ul>
                        <button className="bg-blue-300 p-3 rounded-xl hover:cursor-pointer hover:opacity-90">
                          Add to Project
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ))}
          </div>

          <div>
            {wizard.detailsLoading && (
              <div className="text-[#7C878E] mt-2">Loading details...</div>
            )}
            {wizard.details && (
              <div className="mt-4 rounded border border-[#E2E8F0] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#1E293B] font-semibold mb-2">
                      System Stack Details
                    </div>
                    <div className="text-sm text-[#475569] mb-3">
                      {wizard.details.substrate && (
                        <span className="mr-3">
                          Substrate: {wizard.details.substrate}
                        </span>
                      )}
                      {wizard.details.material && (
                        <span className="mr-3">
                          Material: {wizard.details.material}
                        </span>
                      )}
                      {typeof wizard.details.insulated === "boolean" && (
                        <span className="mr-3">
                          {wizard.details.insulated
                            ? "Insulated"
                            : "Non-insulated"}
                        </span>
                      )}
                      {typeof wizard.details.exposure === "boolean" && (
                        <span className="mr-3">
                          {wizard.details.exposure ? "Exposed" : "Protected"}
                        </span>
                      )}
                      {wizard.details.attachment && (
                        <span className="mr-3">
                          Attachment: {wizard.details.attachment}
                        </span>
                      )}
                    </div>
                  </div>
                  {projectId && (
                    <button
                      className="rounded bg-[#0072CE] text-white px-4 py-2 opacity-70 cursor-not-allowed"
                      disabled
                      title="Save to Project (coming soon)"
                      onClick={() => {
                        alert(wizard.details);
                      }}
                    >
                      Save to Project
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {(() => {
                    if (!wizard.details?.id) {
                      return null;
                    }
                    const combinations =
                      wizard.layerCombinations?.[wizard.details.id];
                    if (combinations === undefined) {
                      return (
                        <div className="rounded border border-[#E2E8F0] p-3 text-sm text-[#7C878E]">
                          Loading product combinations...
                        </div>
                      );
                    }
                    if (combinations.length === 0) {
                      return (
                        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
                          No product combinations available for this system.
                        </div>
                      );
                    }
                    return combinations.map((combo) => (
                      <div
                        key={`details-${wizard.details?.id ?? "system"}-${
                          combo.combination
                        }`}
                        className="frounded border border-[#E2E8F0] p-3"
                      >
                        <div className="text-[#0072CE] font-medium">
                          Combination {combo.combination}
                        </div>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#475569]">
                          {combo.products.map((product, idx) => {
                            const label = product.layer
                              ? `${product.layer}: ${product.name}`
                              : product.name;
                            return (
                              <li
                                key={
                                  product.id ??
                                  `details-${combo.combination}-${idx}`
                                }
                              >
                                {label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
