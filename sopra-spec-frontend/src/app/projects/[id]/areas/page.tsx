import Link from "next/link";
import { Filter, PlusSquare } from "lucide-react";

import { fetchProjectById } from "@/lib/api/projects";
import type { ProjectArea, AreaType } from "@/utils/types";

const areaTypeLabel: Record<AreaType, string> = {
  roof: "Roof",
  wall: "Wall",
  foundation: "Foundation",
  civil_work: "Civil Work",
  internal_wet_area: "Internal Wet Area",
};

const formatDrawingCell = (area: ProjectArea) => {
  const drawings = area.drawings ?? [];
  if (drawings.length === 0) return "Upload";
  return drawings.some((drawing) => drawing.url) ? "View" : "Upload";
};

const formatWarrantyCell = (area: ProjectArea) => {
  const warranties = area.warranties ?? [];
  if (warranties.length === 0) return "?";
  return warranties[0].name;
};

const formatSpecificationCell = (area: ProjectArea) => {
  const specs = area.specifications ?? [];
  if (specs.length === 0) return { view: false, download: false };
  const actions = specs[0].actions ?? {};
  return {
    view: Boolean(actions?.view),
    download: Boolean(actions?.download),
  };
};

export default async function AreasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await fetchProjectById(id);

  if (!project) {
    return <div className="p-6 text-red-500">Project not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-[#0072CE]">
        <Filter size={20} />
        <h3 className="text-xl font-semibold">All Areas</h3>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#B3C7D6] bg-white">
        <table className="min-w-full text-left text-[#0072CE]">
          <thead className="border-b border-[#B3C7D6] bg-[#E9F2FA] font-semibold">
            <tr className="text-sm uppercase tracking-wide">
              <th className="px-6 py-4">Area Name</th>
              <th className="px-6 py-4">Area Type</th>
              <th className="px-6 py-4">Drawing</th>
              <th className="px-6 py-4">Warranty</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Specification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
            {project.areas.map((area) => {
              const specActions = formatSpecificationCell(area);
              return (
                <tr key={area.id} className="hover:bg-[#F5FAFF]">
                  <td className="px-6 py-4">
                    <Link
                      href={`/projects/${project.id}/areas/${area.id}`}
                      className="text-[#0072CE] hover:underline"
                    >
                      {area.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {areaTypeLabel[area.areaType]}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {formatDrawingCell(area)}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">
                    {formatWarrantyCell(area)}
                  </td>
                  <td className="px-6 py-4 text-[#475569]">{area.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#0072CE]">
                      <span
                        className={
                          specActions.view ? "hover:underline" : "opacity-50"
                        }
                      >
                        View
                      </span>
                      <span className="text-[#B3C7D6]">|</span>
                      <span
                        className={
                          specActions.download
                            ? "hover:underline"
                            : "opacity-50"
                        }
                      >
                        Download
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Link
        href={`/systems?projectId=${id}`}
        className="inline-flex items-center gap-2 rounded border border-[#0072CE] px-4 py-2 text-[#0072CE] transition-colors hover:bg-[#0072CE] hover:text-white"
      >
        <PlusSquare size={18} />
        Add New Area
      </Link>
    </div>
  );
}
