"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ProjectCard from "@/components/ProjectCard";
import type { Project, NewProject } from "@/utils/types";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useAuth } from "@/utils/auth-provider";

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { list } = useProjects();

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setProjects([]);
      return;
    }

    let ignore = false;
    list(user.id)
      .then((fetched) => {
        if (!ignore) {
          setProjects(fetched);
        }
      })
      .catch(() => {
        if (!ignore) {
          setProjects([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.id, list]);

  const newProjectPlaceholder: NewProject = useMemo(
    () => ({
      id: "new",
      name: "New Project",
      architect: "",
      builder: "",
      installer: "",
      consultant: "",
      preparedBy: "",
      location: "",
      date: "",
    }),
    []
  );

  const allProjects: (Project | NewProject)[] = [newProjectPlaceholder, ...projects];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      <h4 className="mb-10">
        Select an existing project or create a new project to start generating
        product specifications
      </h4>

      <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
        {allProjects.map((project) => {
          const isNewProject = project.id === "new";
          return (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                router.push(
                  `/projects/${isNewProject ? "new" : project.id}/project-details`
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}