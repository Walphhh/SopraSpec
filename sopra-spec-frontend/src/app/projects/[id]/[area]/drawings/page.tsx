"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, CircleX, X } from "lucide-react"
import { useParams } from "next/navigation"
import { getMockProjectDetail } from "@/lib/projects";
import type { ProjectDetail, Drawing, AreaType, ProjectArea } from "@/utils/types";

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
        drawings: [],
    }
}

export default function DrawingsPage() {
    const { id, area } = useParams() as { id: string; area?: AreaType }
    const [project, setProject] = useState<ProjectDetail | null>(null)
    const [zoomedDrawing, setZoomedDrawing] = useState<Drawing | null>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setProject(getMockProjectDetail(id))
    }, [id])

    if (!project) return <div className="p-6">Loading...</div>
    if (!area) return <div className="p-6 text-red-500">Area not selected</div>

    const areaIndex = project.areas.findIndex((item) => item.areaType === area)
    const activeArea = areaIndex >= 0 ? project.areas[areaIndex] : null
    const currentDrawings: Drawing[] = activeArea?.drawings ?? []

    const handleUpload = (file: File) => {
        const fileUrl = URL.createObjectURL(file)
        const newDrawing: Drawing = { name: file.name, url: fileUrl, areaType: area }

        setProject((prev) => {
            if (!prev) return prev

            const existingIndex = prev.areas.findIndex((item) => item.areaType === area)
            if (existingIndex === -1) {
                const newArea = buildArea(prev, area)
                const updatedArea = { ...newArea, drawings: [newDrawing] }
                return { ...prev, areas: [...prev.areas, updatedArea] }
            }

            const target = prev.areas[existingIndex]
            const drawings = [...(target.drawings ?? []), newDrawing]
            const updatedArea = { ...target, drawings }
            const areas = [...prev.areas]
            areas[existingIndex] = updatedArea
            return { ...prev, areas }
        })
    }

    const handleDelete = (index: number) => {
        if (!confirm("Are you sure you want to delete this drawing?")) return

        setProject((prev) => {
            if (!prev) return prev
            const existingIndex = prev.areas.findIndex((item) => item.areaType === area)
            if (existingIndex === -1) return prev
            const target = prev.areas[existingIndex]
            const current = target.drawings ?? []
            const drawings = current.filter((_, i) => i !== index)
            const updatedArea = { ...target, drawings }
            const areas = [...prev.areas]
            areas[existingIndex] = updatedArea
            return { ...prev, areas }
        })
    }

    const handleModalClick = (e: React.MouseEvent) => {
        if (e.target === modalRef.current) setZoomedDrawing(null)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h5 className="text-left mb-6">
                Drawings / Site Plans - {formatAreaLabel(area)}
            </h5>

            {/* Upload button */}
            <div className="mb-4 flex justify-center">
                <input
                    id="upload-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(file)
                        e.target.value = "" // reset input
                    }}
                />
                <label
                    htmlFor="upload-file"
                    className="inline-flex items-center justify-center w-56 gap-2 px-4 py-2 bg-[#7C878E] text-white rounded cursor-pointer hover:bg-[#0072CE] transition"
                >
                    <Upload size={18} /> Upload File
                </label>
            </div>

            {/* Drawings list */}
            <div>
                {currentDrawings.length > 0 ? (
                    currentDrawings.map((d, idx) => (
                        <div
                            key={d.url + d.name}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-[#7C878E]"
                        >
                            <span
                                className="text-[#0072CE] cursor-pointer"
                                onClick={() => setZoomedDrawing(d)}
                            >
                                {d.name}
                            </span>
                            <button
                                onClick={() => handleDelete(idx)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <CircleX size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-40 flex justify-center items-center text-center">
                        <p className="text-[#7C878E]">No drawing uploaded yet for this area.</p>
                    </div>
                )}
            </div>

            {/* Zoom modal */}
            {zoomedDrawing && (
                <div
                    ref={modalRef}
                    onClick={handleModalClick}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <div className="relative bg-white p-4 rounded max-w-3xl w-full">
                        <button
                            onClick={() => setZoomedDrawing(null)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <X size={20} />
                        </button>

                        {zoomedDrawing.url.toLowerCase().endsWith(".pdf") ? (
                            <iframe
                                src={zoomedDrawing.url}
                                className="w-full h-[600px]"
                                title={zoomedDrawing.name}
                            />
                        ) : (
                            <img
                                src={zoomedDrawing.url}
                                alt={zoomedDrawing.name}
                                className="w-full object-contain max-h-[600px]"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
