import type { ReactNode } from "react";
import Link from "next/link";

import { fetchProjectById } from "@/lib/api/projects";
import ProjectSpecNavBar from "./components/ProjectSpecNavBar";

export default async function SpecLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string; areaId?: string; area?: string }>;
}) {
  const routeParams = await params;
  const { id, areaId, area } = routeParams;

  const projectDetail = await fetchProjectById(id);

  if (!projectDetail) {
    return <div className="p-4 text-red-500">Project not found</div>;
  }

  const currentArea = (() => {
    if (areaId) {
      return projectDetail.areas.find((entry) => entry.id === areaId);
    }
    if (area) {
      return projectDetail.areas.find((entry) => entry.areaType === area);
    }
    return undefined;
  })();

  return (
    <div className="p-4 space-y-4">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 self-start rounded border border-[#0072CE] px-4 py-2 text-[#0072CE] transition-colors hover:bg-[#0072CE] hover:text-white"
      >
        <span aria-hidden>&larr;</span>
        Back to Projects
      </Link>

      <ProjectSpecNavBar
        projectId={projectDetail.id}
        projectName={projectDetail.name}
        currentAreaName={currentArea?.name}
      />
      <div>{children}</div>
    </div>
  );
}