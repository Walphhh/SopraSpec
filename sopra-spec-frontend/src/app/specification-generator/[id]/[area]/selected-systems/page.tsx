"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, FileText, CircleX } from "lucide-react"
import { Project, System, mockProjects, AreaType } from "@/lib/projects"

export default function SelectedSystemsPage() {
    const router = useRouter()
    const { id, area } = useParams() as { id: string; area?: AreaType }
    const [project, setProject] = useState<Project | null>(null)

    useEffect(() => {
        const found = mockProjects.find(p => p.id === id) || null
        setProject(found)
    }, [id])

    const areas: { key: AreaType; label: string }[] = [
        { key: "roof", label: "Roof" },
        { key: "wall", label: "Wall" },
        { key: "foundation", label: "Foundation" },
        { key: "civil_work", label: "Civil Work" },
        { key: "internal_wet_area", label: "Internal Wet Area" },
    ]

    const handleGenerateSpec = (system: System) => {
        alert(`Generate specification for ${system.name}`)
    }

    const handleRemoveSystem = (index: number) => {
        if (!confirm("Are you sure you want to remove this system?")) return

        setProject(prev => {
            if (!prev || !area) return prev
            const currentAreas = prev.areas || {}
            const areaSystems = currentAreas[area]?.systems || []
            const updatedSystems = [...areaSystems]
            updatedSystems.splice(index, 1)

            return {
                ...prev,
                areas: {
                    ...currentAreas,
                    [area]: {
                        ...currentAreas[area],
                        systems: updatedSystems,
                    },
                },
            }
        })
    }

    if (!project) return <div className="p-6">Loading...</div>
    if (!area) return <div className="p-6 text-red-500">Area not selected</div>

    const systemsList: System[] = project.areas?.[area]?.systems || []

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h5 className="text-left mb-6">
                Selected Systems - {area
                    .replace(/[_-]/g, " ")
                    .replace(/\b\w/g, c => c.toUpperCase())
                }
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
