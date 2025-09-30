"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Plus, FileText, CircleX } from "lucide-react"
import { Project, System, mockProjects } from "@/lib/project"

type ProjectArea = "roof" | "wall" | "foundation" | "civilWork" | "internalWetArea"

export default function SelectedSystemsPage() {
    const router = useRouter()
    const { id } = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [activeArea, setActiveArea] = useState<ProjectArea>("roof")

    useEffect(() => {
        const found = mockProjects.find(p => p.id === id) || null
        setProject(found)
    }, [id])

    const areas: { key: ProjectArea; label: string }[] = [
        { key: "roof", label: "Roof" },
        { key: "wall", label: "Wall" },
        { key: "foundation", label: "Foundation" },
        { key: "civilWork", label: "Civil Work" },
        { key: "internalWetArea", label: "Internal Wet Area" },
    ]

    const handleGenerateSpec = (system: System) => {
        alert(`Generate specification for ${system.name}`)
    }

    const handleRemoveSystem = (index: number) => {
        if (!confirm("Are you sure you want to remove this system?")) return

        setProject(prev => {
            if (!prev) return prev
            const updatedSystems = {
                roof: prev.systems?.roof || [],
                wall: prev.systems?.wall || [],
                foundation: prev.systems?.foundation || [],
                civilWork: prev.systems?.civilWork || [],
                internalWetArea: prev.systems?.internalWetArea || [],
                ...prev.systems,
            }
            const areaSystems = [...updatedSystems[activeArea]]
            areaSystems.splice(index, 1)
            updatedSystems[activeArea] = areaSystems
            return { ...prev, systems: updatedSystems }
        })
    }

    if (!project) return <div className="p-6">Loading...</div>

    const systemsList = project.systems?.[activeArea] || []

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
            <h5 className="text-left mb-6">Selected Systems</h5>

            {/* Area tabs */}
            <div className="flex justify-center space-x-2 mb-6">
                {areas.map((a, index) => (
                    <div key={a.key} className="flex items-center">
                        <span
                            onClick={() => setActiveArea(a.key)}
                            className={`cursor-pointer py-1 font-semibold transition-colors ${activeArea === a.key
                                    ? "text-[#0072CE] hover:underline"
                                    : "text-[#7C878E] hover:underline"
                                }`}
                        >
                            {a.label}
                        </span>
                        {index < areas.length - 1 && (
                            <span className="text-[#7C878E] px-5">|</span>
                        )}
                    </div>
                ))}
            </div>

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
                            className={`flex items-center justify-between p-3 pb-5 hover:bg-gray-100 ${idx < systemsList.length - 1 ? "border-b border-[#7C878E]" : ""}`}
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
                    <div className="w-full h-48 flex justify-center items-center">
                        <p className="text-[#7C878E] text-center">No systems added yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
