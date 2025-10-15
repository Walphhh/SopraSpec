"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import "./globals.css";

import ProjectCard from "@/components/ProjectCard";
import type { Project, NewProject } from "@/utils/types";
import { useAuth } from "@/utils/auth-provider";
import { getBackendUrl } from "@/utils/get-backend-url";
import { useProjects } from "@/features/projects/hooks/useProjects";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const { list } = useProjects();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setProjects([]);
      return;
    }

    let ignore = false;
    setIsLoading(true);
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
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, user?.id, list]);

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
      date: new Date().toISOString().split("T")[0],
    }),
    []
  );

  const allProjects: (Project | NewProject)[] = [newProjectPlaceholder, ...projects];

  const handleProjectClick = (project: Project | NewProject) => {
    if (project.id === "new") {
      router.push(`/projects/new/project-details`);
    } else {
      router.push(`/projects/${project.id}/project-details`);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(getBackendUrl("/auth/logout"));
      logout();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h1>You are not logged in</h1>
        <Link
          href="/auth/login"
          className="rounded bg-[#0072CE] px-4 py-2 text-white"
        >
          Login Here
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to SopraSpec {user?.firstName}
      </h1>
      <h4 className="mb-10">
        Start by browsing our systems and generating product specifications
      </h4>

      {isLoading ? (
        <div className="text-center text-[#7C878E]">Loading projects…</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
          {allProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      <button
        className="px-6 py-3 mt-10 bg-[#7C878E] text-white font-bold rounded hover:bg-[#0072CE] transition"
        onClick={() => router.push("/systems")}
      >
        Browse Systems
      </button>

      <div className="mt-10">
        <button
          className="bg-amber-200 hover:cursor-pointer px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}