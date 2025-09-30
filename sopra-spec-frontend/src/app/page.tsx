"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import ProjectCard from "@/components/ProjectCard";
import { Project, NewProject, mockProjects } from "@/lib/projects"
import { useAuth } from "@/utils/auth-provider";
import { getBackendUrl } from "@/utils/get-backend-url";
import axios from "axios";
import Link from "next/link";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects); // Change to integrate with the database later
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth(); // grab logout from provider

  console.log(user);
  /* Integrate with the database later */
  // useEffect(() => {
  //   fetch("/api/projects")
  //     .then((res) => res.json())
  //     .then(setProjects)
  // }, [])

  // Temporary placeholder for creating a new project
  const newProjectPlaceholder: NewProject = {
    id: "new", // temporary ID for routing
    name: "New Project",
    architect: "",
    builder: "",
    installer: "",
    consultant: "",
    preparedBy: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
  };

  const allProjects: (Project | NewProject)[] = [
    newProjectPlaceholder,
    ...projects,
  ];

  const handleProjectClick = async (project: Project | NewProject) => {
    if (project.id === "new") {
      // Navigate to new project creation page
      router.push(`/specification-generator/new/project-details`);
    } else {
      router.push(`/specification-generator/${project.id}/project-details`);
    }
  };

  const handleLogout = async () => {
    try {
      // call backend logout
      await axios.post(getBackendUrl("/auth/logout"));

      // clear local tokens + user state
      logout();

      alert("Logged out successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      {isAuthenticated ? (
        <>
          <h1 className="text-2xl font-bold mb-4">
            Welcome to SopraSpec {user?.firstName}
          </h1>
          <h4 className="mb-10">
            Start by Browsing our Systems and Generating Product Specifications
          </h4>

          <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
            {allProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>

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
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <button>
            <Link href="/auth/login">Login Here</Link>
          </button>
        </>
      )}
    </div>
  );
}