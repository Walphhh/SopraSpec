"use client"

import { distributors } from "@/lib/distributors"
import DistributorCard from "@/components/DistributorCard"

export default function SystemsPage() {
  return (
    <div>
      <h1>Explore SOPREMA Systems</h1>
      <h4>
        Select Our Partner Distributor
      </h4>

      <div className="distributor-grid">
        {distributors.map((dist) => (
          <DistributorCard key={dist.slug} dist={{ ...dist, href: `/systems/${dist.slug}` }} />
        ))}
      </div>
    </div>
  )
}