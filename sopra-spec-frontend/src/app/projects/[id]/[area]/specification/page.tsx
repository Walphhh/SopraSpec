"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Pencil } from "lucide-react";
import type { ProjectDetail, Specification, AreaType, ProjectArea } from "@/utils/types";
import { getMockProjectDetail } from "@/lib/projects";

function formatAreaLabel(area: AreaType) {
  return area.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildArea(project: ProjectDetail, areaType: AreaType): ProjectArea {
  const name = formatAreaLabel(areaType);
  return {
    id: `${project.id}-${areaType}`,
    projectId: project.id,
    name,
    areaType,
    systemStackId: `${project.id}-${areaType}-stack`,
    status: "Draft",
    specifications: [],
  };
}

export default function SpecificationsPage() {
  const { id, area } = useParams() as { id: string; area?: AreaType };
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    setProject(getMockProjectDetail(id));
  }, [id]);

  const statusOptions: Specification["status"][] = [
    "Draft",
    "Final",
    "Archived",
  ];

  const handleStatusChange = (
    index: number,
    newStatus: Specification["status"]
  ) => {
    setProject((prev) => {
      if (!prev || !area) return prev;
      const existingIndex = prev.areas.findIndex(
        (item) => item.areaType === area
      );
      if (existingIndex === -1) return prev;

      const target = prev.areas[existingIndex];
      const specs = [...(target.specifications ?? [])];
      if (!specs[index]) return prev;

      specs[index] = { ...specs[index], status: newStatus };
      const updatedArea = { ...target, specifications: specs };
      const projectAreas = [...prev.areas];
      projectAreas[existingIndex] = updatedArea;
      return { ...prev, areas: projectAreas };
    });
    setEditingStatusIndex(null);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this specification?")) return;
    setProject((prev) => {
      if (!prev || !area) return prev;

      const existingIndex = prev.areas.findIndex(
        (item) => item.areaType === area
      );
      if (existingIndex === -1) return prev;
      const target = prev.areas[existingIndex];
      const specs = (target.specifications ?? []).filter((_, i) => i !== index);
      const updatedArea = { ...target, specifications: specs };
      const projectAreas = [...prev.areas];
      projectAreas[existingIndex] = updatedArea;
      return { ...prev, areas: projectAreas };
    });
  };

  if (!project) return <div className="p-6">Loading...</div>;
  if (!area) return <div className="p-6 text-red-500">Area not selected</div>;

  const existingIndex = project.areas.findIndex(
    (item) => item.areaType === area
  );
  const activeArea =
    existingIndex >= 0
      ? project.areas[existingIndex]
      : buildArea(project, area);
  const specs: Specification[] = activeArea.specifications ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h5 className="text-left mb-6">
        Specifications - {formatAreaLabel(area)}
      </h5>

      {specs.length === 0 ? (
        <div className="w-full flex justify-center">
          <p className="text-[#7C878E] text-center">
            No specifications available for this area.
          </p>
        </div>
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
                      onChange={(e) =>
                        handleStatusChange(
                          idx,
                          e.target.value as Specification["status"]
                        )
                      }
                      onBlur={() => setEditingStatusIndex(null)}
                      autoFocus
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {s.status}{" "}
                      <button
                        onClick={() => setEditingStatusIndex(idx)}
                        title="Change status"
                      >
                        <Pencil
                          size={14}
                          className="inline ml-1 text-gray-500 hover:text-blue-600"
                        />
                      </button>
                    </>
                  )}
                </td>
                <td className="actions">
                  {s.actions?.view && (
                    <a
                      href={s.actions.view}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
  );
}
