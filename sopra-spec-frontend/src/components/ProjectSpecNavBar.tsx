"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useMemo } from "react"

type AreaType = "roof" | "wall" | "foundation" | "civil-work" | "internal-wet-area"
type SectionType = "warranty" | "drawings" | "selected-systems" | "specification"

const areas: { key: AreaType; label: string }[] = [
    { key: "roof", label: "Roof" },
    { key: "wall", label: "Wall" },
    { key: "foundation", label: "Foundation" },
    { key: "civil-work", label: "Civil Work" },
    { key: "internal-wet-area", label: "Internal Wet Area" },
]

const sections: { key: SectionType; label: string }[] = [
    { key: "warranty", label: "Warranty" },
    { key: "drawings", label: "Drawings" },
    { key: "selected-systems", label: "Selected Systems" },
    { key: "specification", label: "Specification" },
]

interface ProjectSpecNavbarProps {
    projectId?: string,
    projectName?: string
}

export default function ProjectSpecNavBar({ projectId, projectName }: ProjectSpecNavbarProps) {
    const pathname = usePathname()
    const { area: activeAreaParam, section: activeSectionParam } = useParams() as {
        area?: AreaType
        section?: SectionType
    }

    const activeTopLink = useMemo(() => {
        if (!projectId) return "all-projects"
        if (!activeAreaParam) return "project-details"
        return activeAreaParam
    }, [projectId, activeAreaParam])

    return (
        <nav className="px-6 py-3 space-y-2">
            {/* Top-level links */}
            <div className="flex items-center space-x-2 font-semibold text-[18px]">
                <Link
                    href="/specification-generator"
                    className={activeTopLink === "all-projects" ? "text-[#0072CE]" : "text-[#7C878E] hover:underline"}
                >
                    All Projects
                </Link>
                <span className="text-[#7C878E] px-3">|</span>

                {projectId && (
                    <>
                        <Link
                            href={`/specification-generator/${projectId}/project-details`}
                            className={activeTopLink === "project-details" ? "text-[#0072CE]" : "text-[#7C878E] hover:underline"}
                        >
                            Project Details
                        </Link>
                        <span className="text-[#7C878E] px-3">|</span>

                        {areas.map((area, idx) => (
                            <span key={area.key} className="flex items-center space-x-2">
                                <Link
                                    href={`/specification-generator/${projectId}/${area.key}/warranty`}
                                    className={activeTopLink === area.key ? "text-[#0072CE]" : "text-[#7C878E] hover:underline"}
                                >
                                    {area.label}
                                </Link>
                                {idx < areas.length - 1 && <span className="text-[#7C878E] px-3">|</span>}
                            </span>
                        ))}
                    </>
                )}
            </div>

            <h2 className="text-2xl font-bold mt-5 mb-5">{projectName}</h2>

            {/* Second-level links (only show when an area is active) */}
            {projectId && activeAreaParam && (
                <div className="flex justify-center space-x-2 font-semibold text-[17px] mt-2">
                    {sections.map((sec, idx) => {
                        const href = `/specification-generator/${projectId}/${activeAreaParam}/${sec.key}`
                        const isActive = pathname === href
                        return (
                            <span key={sec.key} className="flex items-center space-x-2">
                                <Link
                                    href={href}
                                    className={isActive ? "text-[#0072CE]" : "text-[#7C878E] hover:underline"}
                                >
                                    {sec.label}
                                </Link>
                                {idx < sections.length - 1 && <span className="text-[#7C878E] px-10">|</span>}
                            </span>
                        )
                    })}
                </div>
            )}
        </nav>
    )
}
