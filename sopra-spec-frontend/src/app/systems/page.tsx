"use client";

import { distributors } from "@/lib/distributors";
import DistributorCard from "@/components/DistributorCard";

export default function SystemsPage() {
  return (
    <div>
      <h1>Explore SOPREMA Systems & Generate Product Specifications</h1>
      <h4>
        Choose the system, select the products, and generate Product Specifications
      </h4>

      <div className="distributor-grid">
        {distributors.map((dist) => (
          <DistributorCard key={dist.slug} dist={{ ...dist, href: `/systems/${dist.slug}` }} />
        ))}
      </div>
    </div>
  );
}