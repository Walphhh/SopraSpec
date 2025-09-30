'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Project = {
  id: string;
  name: string;
  location: string;
  architect?: string;
  builder?: string;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // Load project from local mock storage
    const key = "mock-projects";
    const projects: Project[] = JSON.parse(localStorage.getItem(key) || "[]");
    const found = projects.find((p) => p.id === id);
    setProject(found || null);
  }, [id]);

  if (!project) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Project not found</h1>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Project Details</h1>

      <div className="rounded border p-4 space-y-2">
        <p><strong>Name:</strong> {project.name}</p>
        <p><strong>Location:</strong> {project.location}</p>
        <p><strong>Architect:</strong> {project.architect || "N/A"}</p>
        <p><strong>Builder:</strong> {project.builder || "N/A"}</p>
      </div>

      <div className="space-x-3">
        <a
          href={`/projects/${project.id}/warranty`}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Warranty
        </a>
        <a
          href={`/projects/${project.id}/drawings`}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Drawings
        </a>
        <a
          href={`/projects/${project.id}/products`}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Products
        </a>
        <a
          href={`/projects/${project.id}/specification`}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Specification
        </a>
      </div>
    </main>
  );
}
