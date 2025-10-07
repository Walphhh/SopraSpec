"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Pencil } from "lucide-react"
import { Project, Specification, mockProjects } from "@/lib/project"

export default function SpecificationsPage() {
    const { id } = useParams()
    const [project, setProject] = useState<Project | null>(null)
    const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(null)

    useEffect(() => {
        const found = mockProjects.find(p => p.id === id) || null
        setProject(found)
    }, [id])

    const statusOptions: Specification["status"][] = ["Draft", "Final", "Archived"]

    const handleStatusChange = (index: number, newStatus: Specification["status"]) => {
        setProject(prev => {
            if (!prev) return prev
            const updatedSpecs = [...(prev.specifications || [])]
            updatedSpecs[index].status = newStatus
            return { ...prev, specifications: updatedSpecs }
        })
        setEditingStatusIndex(null)
    }

    const handleDelete = (index: number) => {
        if (!confirm("Are you sure you want to delete this specification?")) return
        setProject(prev => {
            if (!prev) return prev
            const updatedSpecs = [...(prev.specifications || [])]
            updatedSpecs.splice(index, 1)
            return { ...prev, specifications: updatedSpecs }
        })
    }

    if (!project) return <div className="p-6">Loading...</div>

    const specs = project.specifications || []

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
            <h5 className="mb-6">Project Specifications</h5>

            {specs.length === 0 ? (
                <p>No specifications available.</p>
            ) : (
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Specification Name</th>
                            <th>Date Created</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map((s, idx) => (
                            <tr key={idx}>
                                <td className="system-name">{s.name}</td>
                                <td>{s.dateCreated}</td>
                                <td className="relative">
                                    {editingStatusIndex === idx ? (
                                        <select
                                            value={s.status}
                                            onChange={e => handleStatusChange(idx, e.target.value as Specification["status"])}
                                            onBlur={() => setEditingStatusIndex(null)}
                                            autoFocus
                                            className="border border-gray-300 rounded px-2 py-1"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <>
                                            {s.status}{" "}
                                            <button onClick={() => setEditingStatusIndex(idx)} title="Change status">
                                                <Pencil size={14} className="inline ml-1 text-gray-500 hover:text-blue-600" />
                                            </button>
                                        </>
                                    )}
                                </td>
                                <td className="actions">
                                    {/* TODO: Add logic to be able to actually view the specifications */}
                                    {s.actions?.view && (
                                        <a href={s.actions.view} target="_blank" rel="noopener noreferrer">
                                            View
                                        </a>
                                    )}
                                    {s.actions?.download && (
                                        <a href={s.actions.download} download>
                                            Download
                                        </a>
                                    )}
                                    {s.actions?.delete && (
                                        <button onClick={() => handleDelete(idx)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
