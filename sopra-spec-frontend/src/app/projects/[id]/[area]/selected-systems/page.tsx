"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, FileText, CircleX } from "lucide-react"
import { getMockProjectDetail } from "@/lib/projects";
import type { ProjectDetail, System, AreaType, ProjectArea } from "@/utils/types";

function formatAreaLabel(area: AreaType) {
    return area
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildArea(project: ProjectDetail, areaType: AreaType): ProjectArea {
    const name = formatAreaLabel(areaType)
    return {
        id: `${project.id}-${areaType}`,
        projectId: project.id,
        name,
        areaType,
        systemStackId: `${project.id}-${areaType}-stack`,
        status: "Draft",
        systems: [],
    }
}

export default function SelectedSystemsPage() {
    const router = useRouter()
    const { id, area } = useParams() as { id: string; area?: AreaType }
    const [project, setProject] = useState<ProjectDetail | null>(null)

    useEffect(() => {
        setProject(getMockProjectDetail(id))
    }, [id])

    const handleGenerateSpec = (system: System) => {
        alert(`Generate specification for ${system.name}`)
    }

    const handleRemoveSystem = (index: number) => {
        if (!confirm("Are you sure you want to remove this system?")) return

        setProject((prev) => {
            if (!prev) return prev
            const existingIndex = prev.areas.findIndex((item) => item.areaType === area)
            if (existingIndex === -1) return prev
            const target = prev.areas[existingIndex]
            const systems = (target.systems ?? []).filter((_, i) => i !== index)
            const updatedArea = { ...target, systems }
            const projectAreas = [...prev.areas]
            projectAreas[existingIndex] = updatedArea
            return { ...prev, areas: projectAreas }
        })
    }

    if (!project) return <div className="p-6">Loading...</div>
    if (!area) return <div className="p-6 text-red-500">Area not selected</div>

    const existingIndex = project.areas.findIndex((item) => item.areaType === area)
    const activeArea = existingIndex >= 0 ? project.areas[existingIndex] : buildArea(project, area)
    const systemsList: System[] = activeArea.systems ?? []

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h5 className="text-left mb-6">
                Selected Systems - {formatAreaLabel(area)}
            </h5>

            {/* Add system button */}
            <div className="mb-4 flex justify-center">
                <button
                    onClick={() => router.push(`/systems`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C878E] text-[white] rounded hover:bg-[#0072CE] transition"
                >
                    <Plus size={20} /> Add System
                </button>
            </div>

            {/* Systems list */}
            <div className="space-y-2">
                {systemsList.length > 0 ? (
                    systemsList.map((s, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-3 pb-5 hover:bg-gray-100 ${idx < systemsList.length - 1 ? "border-b border-[#7C878E]" : ""
                                }`}
                        >
                            <span className="text-[#0072CE]">{s.name}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleGenerateSpec(s)}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#7C878E] text-white rounded hover:bg-[#0072CE] transition"
                                >
                                    <FileText size={16} /> Generate Spec
                                </button>
                                <button
                                    onClick={() => handleRemoveSystem(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <CircleX size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-48 flex justify-center items-center text-center">
                        <p className="text-[#7C878E]">No systems added yet for this area.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
