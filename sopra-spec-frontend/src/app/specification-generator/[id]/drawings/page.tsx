"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Upload, CircleX, X } from "lucide-react"
import { Project, Drawing, mockProjects } from "@/lib/project"

type DrawingSection = "roof" | "wall" | "foundation" | "civilWork" | "internalWetArea"

export default function DrawingsPage() {
    const { id } = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [activeSection, setActiveSection] = useState<DrawingSection>("roof")
    const [zoomedDrawing, setZoomedDrawing] = useState<Drawing | null>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const found = mockProjects.find(p => p.id === id) || null
        setProject(found)
    }, [id])

    const sections: { key: DrawingSection; label: string }[] = [
        { key: "roof", label: "Roof" },
        { key: "wall", label: "Wall" },
        { key: "foundation", label: "Foundation" },
        { key: "civilWork", label: "Civil Work" },
        { key: "internalWetArea", label: "Internal Wet Area" },
    ]

    const handleUpload = (section: DrawingSection, file: File) => {
        const fileUrl = URL.createObjectURL(file)
        const newDrawing: Drawing = { name: file.name, url: fileUrl }

        setProject(prev => {
            if (!prev) return prev
            const updatedDrawings: Record<DrawingSection, Drawing[]> = {
                roof: [],
                wall: [],
                foundation: [],
                civilWork: [],
                internalWetArea: [],
                ...prev.drawings,
            }
            updatedDrawings[section] = [...updatedDrawings[section], newDrawing]
            return { ...prev, drawings: updatedDrawings }
        })
    }

    const handleDelete = (section: DrawingSection, index: number) => {
        if (!confirm("Are you sure you want to delete this drawing?")) return

        setProject(prev => {
            if (!prev) return prev
            const updatedDrawings: Record<DrawingSection, Drawing[]> = {
                roof: [],
                wall: [],
                foundation: [],
                civilWork: [],
                internalWetArea: [],
                ...prev.drawings,
            }
            const updatedSection = [...updatedDrawings[section]]
            updatedSection.splice(index, 1)
            updatedDrawings[section] = updatedSection
            return { ...prev, drawings: updatedDrawings }
        })
    }

    const handleModalClick = (e: React.MouseEvent) => {
        if (modalRef.current && e.target === modalRef.current) {
            setZoomedDrawing(null)
        }
    }

    if (!project) return <div className="p-6">Loading...</div>

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
            <h5 className="text-left mb-6">Drawings / Site Plans</h5>

            {/* Section tabs */}
            <div className="flex justify-center space-x-2 mb-6">
                {sections.map((s, index) => (
                    <div key={s.key} className="flex items-center">
                        <span
                            onClick={() => setActiveSection(s.key)}
                            className={`cursor-pointer py-1 font-semibold transition-colors ${
                                activeSection === s.key
                                    ? "text-[#0072CE] hover:underline"
                                    : "text-[#7C878E] hover:underline"
                            }`}
                        >
                            {s.label}
                        </span>
                        {index < sections.length - 1 && (
                            <span className="text-[#7C878E] px-5">|</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Upload file button */}
            <div className="mb-4 flex justify-center">
                <input
                    id="upload-file"
                    type="file"
                    className="hidden"
                    onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(activeSection, file)
                        e.target.value = "" // reset input
                    }}
                />
                <label
                    htmlFor="upload-file"
                    className="inline-flex items-center justify-center w-56 gap-2 px-4 py-2 bg-[#E2E2E2] text-[#7C878E] rounded cursor-pointer hover:bg-[#0072CE] hover:text-white transition"
                >
                    <Upload size={18} /> Upload File
                </label>
            </div>

            {/* Drawings list */}
            <div className="space-y-2">
                {project.drawings &&
                project.drawings[activeSection] &&
                project.drawings[activeSection].length > 0 ? (
                    project.drawings[activeSection].map((d, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                        >
                            <span
                                className="text-[#0072CE] cursor-pointer"
                                onClick={() => setZoomedDrawing(d)}
                            >
                                {d.name}
                            </span>
                            <button
                                onClick={() => handleDelete(activeSection, idx)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <CircleX size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-4">
                        <p className="text-[#7C878E]">No drawing uploaded yet.</p>
                    </div>
                )}
            </div>

            {/* Zoom modal */}
            {/* {zoomedDrawing && (
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
            )} */}
            
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

                        {/* TODO: Integrate to allow PDF viewer later */}
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
