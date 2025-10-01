"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectSpecNavbarProps {
  projectId?: string;
  projectName?: string;
  currentAreaName?: string;
}

const AREA_SEGMENTS = [
  "warranty",
  "drawings",
  "selected-systems",
  "specification",
  "areas",
];

export default function ProjectSpecNavBar({
  projectId,
  projectName,
  currentAreaName,
}: ProjectSpecNavbarProps) {
  const pathname = usePathname();

  const projectDetailsHref = projectId
    ? `/projects/${projectId}/project-details`
    : "/projects";
  const areasHref = projectId ? `/projects/${projectId}/areas` : "/projects";

  const isProjectDetailsActive = pathname.includes("/project-details");
  const isAreasActive =
    !isProjectDetailsActive &&
    AREA_SEGMENTS.some((segment) => pathname.includes(`/${segment}`));

  return (
    <nav className="space-y-3">
      <div className="flex items-center gap-4 text-lg font-semibold">
        <Link
          href={projectDetailsHref}
          className={
            isProjectDetailsActive
              ? "text-[#0072CE]"
              : "text-[#7C878E] hover:underline"
          }
        >
          Project Details
        </Link>
        <span className="text-[#7C878E]">|</span>
        <div className="flex items-center gap-3">
          <Link
            href={areasHref}
            className={
              isAreasActive
                ? "text-[#0072CE]"
                : "text-[#7C878E] hover:underline"
            }
          >
            Areas
          </Link>
          {currentAreaName && (
            <span className="flex items-center gap-3 text-[#0072CE]">
              <span aria-hidden>�</span>
              <span className="font-normal">{currentAreaName}</span>
            </span>
          )}
        </div>
      </div>

      {projectName && (
        <h2 className="text-2xl font-bold text-[#0072CE]">{projectName}</h2>
      )}
    </nav>
  );
}
