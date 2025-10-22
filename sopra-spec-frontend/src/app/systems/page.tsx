"use client";

import { useSearchParams } from "next/navigation";
import { distributors } from "@/lib/distributors";
import DistributorCard from "@/components/DistributorCard";
import SystemWizard from "./components/SystemWizard";

export default function SystemsPage() {
  const params = useSearchParams();
  const projectId = params.get("projectId") ?? undefined;

  return (
    <div>
      {projectId ? (
        <div>
          <h1>Create Area: Choose System</h1>
          <p className="text-[#7C878E]">Project ID: {projectId}</p>
          <SystemWizard projectId={projectId} />
        </div>
      ) : (
        <div>
          <h1>Explore SOPREMA Systems</h1>
          <h4>Select Our Partner Distributor</h4>

          <div className="distributor-grid">
            {distributors.map((dist) => (
              <DistributorCard
                key={dist.slug}
                dist={{ ...dist, href: `/systems/${dist.slug}` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
