"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import type { AreaType, ProjectDetail, Warranty } from "@/utils/types";
import { useProjects } from "@/features/projects/hooks/useProjects";

function formatAreaLabel(area: AreaType) {
  return area.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function WarrantyPage() {
  const params = useParams();
  const { get } = useProjects();

  const projectId = useMemo(() => {
    if (Array.isArray(params?.id)) return params.id[0];
    return (params?.id as string) ?? "";
  }, [params]);

  const areaId = useMemo(() => {
    if (Array.isArray(params?.areaId)) return params.areaId[0];
    return params?.areaId as string | undefined;
  }, [params]);

  const areaSlug = useMemo<AreaType | undefined>(() => {
    if (Array.isArray(params?.area)) return params.area[0] as AreaType;
    return params?.area as AreaType | undefined;
  }, [params]);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      return;
    }

    let ignore = false;
    setIsLoading(true);

    get(projectId)
      .then((detail) => {
        if (!ignore) setProject(detail);
      })
      .catch(() => {
        if (!ignore) setProject(null);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId, get]);

  if (isLoading || !project) {
    return <div className="p-6 text-[#7C878E]">Loading warranties…</div>;
  }

  const activeArea = project.areas.find((area) => {
    if (areaId) return area.id === areaId;
    if (areaSlug) return area.areaType === areaSlug;
    return false;
  });

  if (!activeArea) {
    return <div className="p-6 text-red-500">Area not found</div>;
  }

  const areaLabel = activeArea.name || formatAreaLabel(activeArea.areaType);
  const warranties: Warranty[] = activeArea.warranties ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h5 className="text-sm font-semibold uppercase text-[#7C878E]">
          Area
        </h5>
        <h2 className="text-2xl font-bold text-[#0072CE]">{areaLabel}</h2>
        <p className="text-[#7C878E]">Warranty overview for this area</p>
      </div>

      {warranties.length === 0 ? (
        <div className="w-full rounded border border-dashed border-[#B3C7D6] bg-white py-16 text-center text-[#7C878E]">
          No warranties are recorded for this area yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#B3C7D6] bg-white shadow-sm">
          <table className="min-w-full text-left text-sm text-[#1E293B]">
            <thead className="bg-[#E9F2FA] text-[#0072CE]">
              <tr>
                <th className="px-6 py-3">Warranty Name</th>
                <th className="px-6 py-3">Coverage Period</th>
                <th className="px-6 py-3">Issue Date</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {warranties.map((warranty, index) => (
                <tr key={`${warranty.name}-${index}`} className="hover:bg-[#F5FAFF]">
                  <td className="px-6 py-4 font-medium text-[#0072CE]">
                    {warranty.name}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {warranty.warrantyPeriod || "—"}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {warranty.issueDate || "—"}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {warranty.expiryDate || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                        warranty.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          warranty.status === "Active" ? "bg-green-600" : "bg-red-600"
                        }`}
                      />
                      {warranty.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}