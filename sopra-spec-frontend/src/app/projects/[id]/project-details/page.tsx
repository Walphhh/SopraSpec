"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Upload, Pencil } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { mockProjects } from "@/lib/projects";
import type { Project } from "@/utils/types";

export default function ProjectDetailsPage() {
    const router = useRouter()
    const { id } = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [form, setForm] = useState<any>({})
    const [isModified, setIsModified] = useState(false)
    const [error, setError] = useState("")
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [missingFields, setMissingFields] = useState<string[]>([])

    useEffect(() => {
        if (id === "new") {
            const newProj = {
                id: "", // will generate on save
                name: "",
                architect: "",
                builder: "",
                installer: "",
                consultant: "",
                preparedBy: "",
                location: "",
                date: "",
                notes: "",
                thumbnail: "",
                ownerId: "dummy-owner"
            }
            setProject(newProj)
            setForm(newProj)
        } else {
            const found = mockProjects.find((p) => p.id === id) || null
            setProject(found)
            setForm(found)
        }
    }, [id])

    if (!project) return <div className="p-6">Loading...</div>

    const fields = [
        { key: "name", label: "Project Name", required: true },
        { key: "architect", label: "Architect", required: true },
        { key: "builder", label: "Builder", required: true },
        { key: "installer", label: "Installer", required: true },
        { key: "consultant", label: "Consultant", required: true },
        { key: "preparedBy", label: "Prepared by", required: true },
        { key: "location", label: "Location", required: true },
        { key: "date", label: "Date", required: true },
        { key: "notes", label: "Notes", required: false },
    ]

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value })
        setIsModified(true)
        setError("")
        setMissingFields((prev) => prev.filter((f) => f !== key))
    }

    const handleSave = () => {
        const missing: string[] = []
        for (const f of fields) {
            if (f.required && !form[f.key]?.trim()) {
                missing.push(f.key)
            }
        }

        if (missing.length > 0) {
            setError("Please fill in all required fields")
            setMissingFields(missing)
            return
        }

        let newProjectId = project!.id || uuidv4() // generate a new ID if empty

        // Update project state
        const updatedProject: Project = { ...project!, ...form, id: newProjectId }

        setProject(updatedProject)
        setIsModified(false)
        setError("")
        setMissingFields([])

        alert("Project details saved!")

        // Redirect to the new project's URL if it was a new project 
        // if (!project!.id) {
        //     router.replace(`/specification-generator/${newProjectId}/project-details`)
        // }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h5 className="text-left -mt-6 mb-6">Project Details</h5>

            <div className="space-y-4">
                {fields.map((f) => {
                    const isError = missingFields.includes(f.key)
                    return (
                        <div key={f.key} className="flex items-center space-x-4">
                            <label className="w-40 font-semibold text-[#0072CE] text-left">
                                {f.label} {f.required ? <span className="text-red-500">*</span> : "(optional)"}:
                            </label>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={form[f.key] || ""}
                                    placeholder={id === "new" ? `Please Enter ${f.label}` : ""}
                                    onChange={(e) => handleChange(f.key, e.target.value)}
                                    onFocus={() => setFocusedField(f.key)}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full border-2 rounded p-2 pr-10 outline-none bg-transparent transition-colors ${isError
                                        ? "border-red-500 text-red-500"
                                        : "border-[#7C878E] text-[#7C878E] focus:border-[#0072CE] focus:text-[#0072CE]"
                                        }`}
                                />
                                <Pencil
                                    size={18}
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${focusedField === f.key
                                        ? "text-[#0072CE]"
                                        : isError
                                            ? "text-red-500"
                                            : "text-[#7C878E]"
                                        }`}
                                />
                            </div>
                        </div>
                    )
                })}

                {/* Thumbnail */}
                <div className="flex items-center space-x-4">
                    <label className="w-40 font-semibold text-[#0072CE] text-left">
                        Thumbnail (optional):
                    </label>

                    <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                const imageUrl = URL.createObjectURL(file)
                                handleChange("thumbnail", imageUrl)
                            }
                        }}
                    />

                    <label
                        htmlFor="thumbnail-upload"
                        className="flex items-center justify-center w-48 px-4 py-2 bg-[#E2E2E2] text-[#7C878E] rounded cursor-pointer hover:bg-[#0072CE] hover:text-white transition"
                    >
                        <Upload className="mr-2" size={18} /> Upload Image
                    </label>

                    {form.thumbnail && (
                        <img
                            src={form.thumbnail}
                            alt="Thumbnail preview"
                            className="ml-2 w-20 h-20 object-cover rounded border"
                        />
                    )}
                </div>

                {error && <p className="text-red-500 font-semibold">{error}</p>}

                <button
                    className={`px-6 py-3 font-bold rounded text-white ${isModified
                        ? "bg-[#0072CE] hover:bg-[#0072CE]"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                    disabled={!isModified}
                    onClick={handleSave}
                >
                    Save Project Details
                </button>
            </div>
        </div>
    )
}
