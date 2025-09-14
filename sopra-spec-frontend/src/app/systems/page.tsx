"use client"

import Link from "next/link"
import Image from "next/image"

export default function ProductsPage() {
    const distributors = [
        {
            name: "Allduro",
            href: "/products/allduro",
            logo: "/logo-allduro.png",
            overview: "Western Australia’s leading supplier of waterproofing, concrete repair, floor coatings, joint sealants, and tiling solutions for new builds and remediation.",
            headquarter: "14 Vulcan Road Canning Vale WA 6155.",
            backgroundColor: "#F4E2DC",
            color: "#F45B2C",
        },
        {
            name: "Bayset",
            href: "/products/bayset",
            logo: "/logo-bayset.webp",
            overview: "An Australian family-owned brand with 20+ years of experience designing waterproofing systems for balconies, roofs, wet areas, and below-ground structures.",
            headquarter: "48 Weaver Street, Coopers Plains QLD 4108.",
            backgroundColor: "#EBD1D9",
            color: "#CD163F",
        },
        {
            name: "Enduroflex",
            href: "/products/enduroflex",
            logo: "/logo-enduroflex.webp",
            overview: "Australia’s top provider of insulation and waterproofing solutions for residential, commercial, and infrastructure projects, supporting energy efficiency and compliance.",
            headquarter: "16/5 Ponderosa Parade, Warriewood NSW 2102.",
            backgroundColor: "#E0E4DC",
            color: "#5E8638",
        },
    ]

    return (
        <div>
            <h1>Explore SOPREMA Systems & Generate Product Specifications</h1>
            <h4>Choose the system, select the products, and generate Product Specifications</h4>
            <div className="distributor-grid">
                {distributors.map((dist) => (
                    <Link key={dist.name} href={dist.href}>
                        <div
                            className="distributor-card"
                            style={{ backgroundColor: dist.backgroundColor }}
                        >
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                                <Image
                                    src={dist.logo}
                                    alt={`${dist.name} logo`}
                                    width={300}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>

                            <div style={{ color: dist.color }}>
                                <p>
                                    <span className="font-bold">Overview:</span> {dist.overview}
                                </p>
                                <p>
                                    <span className="font-bold">Headquarter:</span> {dist.headquarter}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}