"use client";

import dynamic from "next/dynamic";
import OptionCard from "@/components/OptionCard";
import { useSystemWizard } from "@/lib/hooks/useSystemWizard";
import Link from "next/link";
import type { Building3DProps } from "../[distributor]/components/Building3D";

const Building3D = dynamic<Building3DProps>(
  () => import("../[distributor]/components/Building3D"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-2xl bg-white text-[#7C878E] shadow-sm">
        Loading 3D building...
      </div>
    ),
  }
);

const formatDisplayText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const stringValue = String(value);
  if (!stringValue) return "";

  const normalised = stringValue.replace(/[_\s]+/g, " ").trim();
  return normalised
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const SUPPORTED_AREA_TYPES = new Set([
  "roof",
  "wall",
  "foundation",
  "civil_work",
  "internal_wet_area",
]);

const normaliseAreaType = (value: string): string => {
  const normalised = value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/-/g, "_")
    .toLowerCase();
  if (normalised === "civil_works") return "civil_work";
  if (normalised === "internalwetarea") return "internal_wet_area";
  return normalised;
};

export default function SystemWizard({ projectId }: { projectId?: string }) {
  const wizard = useSystemWizard();
  const areaSelectionActive = wizard.currentStep === "area_type";

  const buildingAreaOptions =
    areaSelectionActive && wizard.options.length > 0
      ? wizard.options
          .map((opt) => {
            const raw =
              typeof opt.value === "string"
                ? opt.value
                : typeof opt.value === "number"
                ? String(opt.value)
                : String(opt.value ?? "");
            const normalised = normaliseAreaType(raw);
            if (!raw || !SUPPORTED_AREA_TYPES.has(normalised)) {
              return null;
            }
            return { raw, normalised };
          })
          .filter(
            (entry): entry is { raw: string; normalised: string } =>
              entry !== null
          )
      : undefined;

  const buildingAllowedAreas = buildingAreaOptions
    ? Array.from(new Set(buildingAreaOptions.map((entry) => entry.normalised)))
    : undefined;
  const areaSelectionMap = buildingAreaOptions
    ? new Map(buildingAreaOptions.map((entry) => [entry.normalised, entry.raw]))
    : undefined;

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-semibold text-[#0072CE]">System Selection</h3>

      <div className="flex flex-wrap gap-3 text-sm text-[#7C878E]">
        {wizard.selections.area_type && (
          <span className="rounded-full bg-[#E2E8F0] px-3 py-1 text-[#0072CE] font-medium">
            Area: {formatDisplayText(wizard.selections.area_type)}
          </span>
        )}
        {wizard.selections.distributor && (
          <span className="rounded-full bg-[#E2E8F0] px-3 py-1 text-[#0072CE] font-medium">
            Distributor: {formatDisplayText(wizard.selections.distributor)}
          </span>
        )}
      </div>

      {wizard.error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {wizard.error}
        </div>
      )}

      {!wizard.currentStep && wizard.loading && (
        <div className="text-[#7C878E]">Loading options...</div>
      )}

      {wizard.currentStep && !wizard.finished && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-white p-8 shadow-sm">
            <div>
              <div className="text-sm text-[#7C878E]">
                Current Step: {formatDisplayText(wizard.currentStep)}
              </div>
              <div className="text-lg text-[#1E293B] font-medium">
                Select {formatDisplayText(wizard.currentStep)}
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

          {areaSelectionActive && (
            <div className="mx-auto w-full max-w-6xl">
              <div className="mb-4 text-center text-[#7C878E]">
                Click the building or use the cards to choose an area.
              </div>
              <div className="rounded-2xl bg-white py-8 px-4 shadow-sm">
                <Building3D
                  distributor={String(wizard.selections.distributor ?? "")}
                  allowedAreas={buildingAllowedAreas}
                  onSelectArea={(areaType) => {
                    const rawValue = areaSelectionMap?.get(areaType) ?? areaType;
                    void wizard.setSelectionForActive(rawValue);
                  }}
                  width="100%"
                  height={640}
                />
              </div>
            </div>
          )}

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
                title={
                  typeof opt.label === "string" && opt.label.trim().length > 0
                    ? opt.label
                    : formatDisplayText(opt.label ?? opt.value)
                }
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

          {wizard.currentStep === "distributor" &&
            wizard.selections.area_type && (
              <div className="text-center text-[#7C878E]">
                Selected area:&nbsp;
                <span className="font-semibold text-[#0072CE]">
                  {formatDisplayText(wizard.selections.area_type)}
                </span>
                . Choose a distributor to continue.
              </div>
            )}

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
                </div>
                <div className="mt-3 space-y-5">
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
                        <ul className="mt-2 space-y-1 pl-5 text-sm text-[#475569] list-none">
                          {combo.products.map((product, idx) => {
                            const layerLabel = product.layer
                              ? formatDisplayText(product.layer)
                              : "";
                            const nameLabel = formatDisplayText(product.name);
                            const label = layerLabel
                              ? `${layerLabel}: ${nameLabel}`
                              : nameLabel;
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
                        {projectId && (
                          <Link
                            href={`/projects/${projectId}/areas/new?stackId=${rec.id}&combination=${combo.combination}&areaType=${wizard.selections.area_type}`}
                          >
                            <button
                              className={`bg-blue-300 p-3 rounded-xl hover:cursor-pointer hover:opacity-90`}
                              onClick={() => {
                                console.log(combo.products);
                              }}
                            >
                              Add to Project
                            </button>
                          </Link>
                        )}
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
                            const layerLabel = product.layer
                              ? formatDisplayText(product.layer)
                              : "";
                            const nameLabel = formatDisplayText(product.name);
                            const label = layerLabel
                              ? `${layerLabel}: ${nameLabel}`
                              : nameLabel;
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










