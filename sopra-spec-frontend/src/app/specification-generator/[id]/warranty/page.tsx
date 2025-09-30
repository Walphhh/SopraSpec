"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Project, mockProjects, Warranty } from "@/lib/project"

export default function WarrantyPage() {
    const { id } = useParams()
    const [project, setProject] = useState<Project | null>(null)

    useEffect(() => {
        const found = mockProjects.find(p => p.id === id) || null
        setProject(found)
    }, [id])

    if (!project) return <div className="p-6">Loading...</div>

    const warranties: Warranty[] = project.warranties || []

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
            <h5 className="text-left mb-6">Warranty</h5>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>System Name</th>
                        <th>Warranty</th>
                        <th>Issue Date</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {project.warranties?.map((w, i) => (
                        <tr key={i}>
                            <td className="system-name">{w.systemName}</td>
                            <td className="warranty-period">{w.warrantyPeriod || "15 years"}</td>
                            <td>{w.issueDate}</td>
                            <td>{w.expiryDate}</td>
                            <td>
                                <span
                                    className={`status-circle ${w.status === "Active"
                                            ? "status-active"
                                            : w.status === "Expired"
                                                ? "status-expired"
                                                : "status-pending"
                                        }`}
                                ></span>
                                {w.status}
                            </td>
                            <td className="actions">
                                {w.actions?.view && (
                                    <a href={w.actions.view} target="_blank">
                                        View
                                    </a>
                                )}
                                {w.actions?.download && (
                                    <a href={w.actions.download} download>
                                        Download
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
