"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import ProjectCard from "@/components/ProjectCard";
import { Project, mockProjects } from "@/lib/project";
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

  // Add default "New Project" card
  const allProjects: Project[] = [
    {
      id: "new",
      name: "New Project",
      architect: "Please Enter Architect Name",
      builder: "Please Enter Builder Name",
      installer: "Please Enter Installer Name",
      consultant: "Please Enter Consultant Name",
      preparedBy: "Please Enter Your Name",
      location: "Please Enter Project Location",
      date: "2025-09-30",
      notes: "Please Enter Any Notes (optional)",
      thumbnail: "",
      isNew: true,
    },
    ...projects,
  ];

  const handleLogout = async () => {
    try {
      // call backend logout
      await axios.post(getBackendUrl("/auth/logout"));

      // clear local tokens + user state
      logout();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
              Welcome to SopraSpec {user?.firstName}
            </h1>
            <h4 className="mb-10">
              Start by Browsing our Systems and Generating Product
              Specifications
            </h4>

            <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
              {allProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() =>
                    router.push(
                      `/specification-generator/${
                        project.isNew ? "new" : project.id
                      }/project-details`
                    )
                  }
                />
              ))}
            </div>

            <button
              className="px-6 py-3 mt-10 bg-[#7C878E] text-white font-bold rounded hover:bg-[#0072CE] transition"
              onClick={() => router.push("/systems")}
            >
              Browse Systems
            </button>
          </div>
          <button
            className="p-3 rounded-sm bg-[#0072CE] text-black hover:cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1>You are not logged in</h1>
          <button className="p-3 rounded-sm bg-[#0072CE] text-black">
            <Link href="/auth/login">Login Here</Link>
          </button>
        </div>
      )}
    </div>
  );
}
