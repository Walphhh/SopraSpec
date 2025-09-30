"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Project, mockProjects } from "@/lib/project"
import { Upload, Pencil } from "lucide-react"

export default function ProjectDetailsPage() {
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
                id: "new",
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
                isNew: true,
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
        setMissingFields((prev) => prev.filter((f) => f !== key)) // remove field from missing when filled
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

        alert("Project details saved!")
        setIsModified(false)
        setError("")
        setMissingFields([])
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-2">
                {project.isNew ? "Create New Project" : project.name}
            </h2>
            <h5 className="text-left mb-6 -ml-30">Project Details</h5>

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
                                    placeholder={project.isNew ? `Please Enter ${f.label}` : ""}
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

                    {/* Hidden file input */}
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

                    {/* Trigger button */}
                    <label
                        htmlFor="thumbnail-upload"
                        className="flex items-center justify-center w-48 px-4 py-2 bg-[#E2E2E2] text-[#7C878E] rounded cursor-pointer hover:bg-[#0072CE] hover:text-white transition"
                    >
                        <Upload className="mr-2" size={18} /> Upload Image
                    </label>

                    {/* Preview */}
                    {form.thumbnail && (
                        <img
                            src={form.thumbnail}
                            alt="Thumbnail preview"
                            className="ml-2 w-20 h-20 object-cover rounded border"
                        />
                    )}
                </div>

                {/* Error message */}
                {error && <p className="text-red-500 font-semibold">{error}</p>}

                {/* Save button */}
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
