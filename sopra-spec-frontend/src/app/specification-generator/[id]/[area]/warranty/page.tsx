"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Project, Warranty, AreaType, mockProjects } from "@/lib/projects"

export default function WarrantyPage() {
    const { id, area: activeAreaParam } = useParams() as { id: string; area?: string }
    const [project, setProject] = useState<Project | null>(null)

    useEffect(() => {
        const found = mockProjects.find(p => p.id === id) || null
        setProject(found)
    }, [id])

    if (!project) return <div className="p-6">Loading...</div>

    // cast the area to AreaType
    const activeArea = activeAreaParam as AreaType
    const warranties: Warranty[] = activeArea ? project.areas?.[activeArea]?.warranties || [] : []


    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <h5 className="text-left mb-6">
                Warranty - {activeArea
                    .replace(/[_-]/g, " ")
                    .replace(/\b\w/g, c => c.toUpperCase())
                }
            </h5>

            {warranties.length === 0 ? (
                <div className="w-full flex justify-center">
                    <p className="text-[#7C878E] text-center">No warranties available for this area.</p>
                </div>
            ) : (
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>System Name</th>
                            <th>Warranty</th>
                            <th>Issue Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warranties.map((w, i) => (
                            <tr key={i}>
                                <td className="system-name">{w.name}</td>
                                <td className="warranty-period">{w.warrantyPeriod}</td>
                                <td>{w.issueDate}</td>
                                <td>{w.expiryDate}</td>
                                <td>
                                    <span
                                        className={`status-circle ${w.status === "Active" ? "status-active" : "status-expired"
                                            }`}
                                    ></span>
                                    {w.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
