"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import "./globals.css"
import ProjectCard from "@/components/ProjectCard"
import { Project, mockProjects } from "@/lib/project"

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects) // Change to integrate with the database later
  const router = useRouter()

  /* Integrate with the database later */
  // useEffect(() => {
  //   fetch("/api/projects")
  //     .then((res) => res.json())
  //     .then(setProjects)
  // }, [])

  // Add default "New Project" card
  const allProjects: Project[] = [
    { id: "new", name: "New Project", isNew: true },
    ...projects
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to SopraSpec</h1>
      <h4 className="mb-10">Start by Browsing our Systems and Generating Product Specifications</h4>

      <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
        {allProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() =>
              router.push(`/specification-generator/${project.isNew ? 'new' : project.id}/project-details`)
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
  )
}
