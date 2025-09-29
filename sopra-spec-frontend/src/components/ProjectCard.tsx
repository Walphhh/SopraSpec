"use client"

import { FolderKanban, FolderPlus } from "lucide-react"

export type Project = {
    id: string
    name: string
    thumbnail?: string
    isNew?: boolean
}

export default function ProjectCard({
    project,
    onClick,
}: {
    project: Project
    onClick: () => void
}) {
    return (
        <div
            onClick={onClick}
            className="
                group cursor-pointer w-[250px] h-[250px] flex flex-col items-center justify-center
                rounded-lg bg-[#E2E2E2]
                hover:bg-[#0072CE]
            "
        >
            {project.isNew ? (
                <div className="flex items-center justify-center mb-2">
                    <FolderPlus
                        size={150}
                        className="text-[#0072CE] transition-colors duration-300 group-hover:text-white"
                    />
                </div>
            ) : project.thumbnail ? (
                <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-150 h-150 object-contain mb-2"
                />
            ) : (
                <div className="flex items-center justify-center mb-2">
                    <FolderKanban
                        size={150}
                        className="text-[#0072CE] group-hover:text-white"
                    />
                </div>
            )
            }
            < h2 className="text-center font-semibold group-hover:!text-white">{project.name}</h2>
        </div >
    )
}
