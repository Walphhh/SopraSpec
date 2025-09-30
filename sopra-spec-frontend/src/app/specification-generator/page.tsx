"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import ProjectCard from "@/components/ProjectCard"
import { Project, mockProjects } from "@/lib/project"

export default function SpecificationGeneratorPage() {
    const [projects, setProjects] = useState<Project[]>(mockProjects) // change to integrate with the database later
    const router = useRouter()

    /* Integrate with the database later */
    // useEffect(() => {
    //     fetch("/api/projects")
    //         .then((res) => res.json())
    //         .then(setProjects)
    // }, [])

    // Add default "New Project" card
    const allProjects: Project[] = [
        {
            id: "new",
            name: "New Project",
            architect: "",
            builder: "",
            installer: "",
            consultant: "",
            preparedBy: "",
            location: "",
            date: "",
            notes: ")",
            thumbnail: "",
            isNew: true

        },
        ...projects
    ]

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Project</h1>
            <h4 className="mb-10">Select Existing Project or Create New Projec to Start Generating Product Specifications</h4>

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
        </div>
    )
}
