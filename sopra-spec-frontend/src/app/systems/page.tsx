"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProjects } from "@/features/projects/hooks/useProjects";
import SystemWizard from "./components/SystemWizard";

export default function SystemsPage() {
  const params = useSearchParams();
  const projectId = params.get("projectId") ?? undefined;
  const projectNameParam = params.get("projectName") ?? undefined;
  const { get } = useProjects();

  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProjectName(null);
      setProjectError(null);
      setProjectLoading(false);
      return;
    }

    if (projectNameParam) {
      setProjectName(projectNameParam);
      setProjectError(null);
      setProjectLoading(false);
      return;
    }

    let ignore = false;
    setProjectLoading(true);
    setProjectError(null);
    get(projectId)
      .then((detail) => {
        if (ignore) return;
        setProjectName(detail?.name ?? null);
      })
      .catch(() => {
        if (ignore) return;
        setProjectError("Unable to load project details.");
        setProjectName(null);
      })
      .finally(() => {
        if (!ignore) setProjectLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId, get]);

  return (
    <div>
      {projectId ? (
        <div>
          <h1>New Area: Choose System</h1>
          <div className="text-[#7C878E]">
            {projectLoading && <span>Loading project…</span>}
            {!projectLoading && projectError && <span>{projectError}</span>}
            {!projectLoading && !projectError && (
              <span>
                Project:{" "}
                <strong>{projectName && projectName.length > 0 ? projectName : projectId}</strong>
              </span>
            )}
          </div>
          <SystemWizard projectId={projectId} />
        </div>
      ) : (
        <div>
          <SystemWizard />
        </div>
      )}
    </div>
  );
}
