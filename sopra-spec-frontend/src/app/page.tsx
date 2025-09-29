"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import "./globals.css"
import ProjectCard from "@/components/ProjectCard"
import { Project, mockProjects } from "@/lib/project"

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]) 
  const router = useRouter()

  /* Integrate with the database later */
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => {
        setProjects(mockProjects)
      })
  }, [])

  // Add default "New Project" card
  const allProjects: Project[] = [
    { id: "new", name: "New Project", isNew: true },
    ...projects
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Projects</h1>
      <div className="flex flex-wrap justify-center gap-x-[30px] gap-y-[30px]">
        {allProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() =>
              project.isNew
                ? router.push("/specification-generator")
                : router.push(`/projects/${project.id}/specification-generator`)
            }
          />
        ))}
      </div>
    </div>
  )
}
