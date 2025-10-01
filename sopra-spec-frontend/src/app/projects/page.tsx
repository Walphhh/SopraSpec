"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import ProjectCard from "@/components/ProjectCard";
import { mockProjects } from "@/lib/projects";
import type { Project, NewProject } from "@/utils/types";

export default function SpecificationGeneratorPage() {
    const [projects] = useState<Project[]>(mockProjects); // change to integrate with the database later
    const router = useRouter();

    /* TODO: Integrate with the database later */
    // useEffect(() => {
    //     fetch("/api/projects")
    //         .then((res) => res.json())
    //         .then(setProjects)
    // }, [])

    const newProjectPlaceholder: NewProject = {
        id: "new",
        name: "New Project",
        architect: "",
        builder: "",
        installer: "",
        consultant: "",
        preparedBy: "",
        location: "",
        date: "",
    };

    const allProjects: (Project | NewProject)[] = [
        newProjectPlaceholder,
        ...projects,
    ];

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
                                    `/projects/${isNewProject ? "new" : project.id
                                    }/project-details`
                                )
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
}
