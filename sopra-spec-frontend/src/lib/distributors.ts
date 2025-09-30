export type ApplicationArea = {
  name: string,
  slug: string,
  image?: string,
}

export type Distributor = {
  name: string,
  slug: string,
  href: string,
  logo: string,
  overview: string,
  headquarter: string,
  backgroundColor: string,
  color: string,
  applicationAreas: ApplicationArea[],
}

export const distributors: Distributor[] = [
  {
    name: "Allduro",
    slug: "allduro",
    href: "/systems/allduro",
    logo: "/logo-allduro.png",
    overview: "Western Australia’s leading supplier of waterproofing, concrete repair, floor coatings, joint sealants, and tiling solutions for new builds and remediation.",
    headquarter: "14 Vulcan Road Canning Vale WA 6155.",
    backgroundColor: "#F4E2DC",
    color: "#F45B2C",
    applicationAreas: [
      { name: "Roof", slug: "roof", image: "/areas/roof.jpg" },
      { name: "Wall", slug: "wall", image: "/areas/wall.jpg" },
      { name: "Foundation", slug: "foundation", image: "/areas/foundation.jpg" },
      { name: "Civil Works", slug: "civil-works", image: "/areas/civil.jpg" },
      { name: "Internal Wet Areas and Direct Stick Tile System", slug: "internal-wet-areas", image: "/areas/wet.jpg" },
    ],
  },
  {
    name: "Bayset",
    slug: "bayset",
    href: "/systems/bayset",
    logo: "/logo-bayset.webp",
    overview: "An Australian family-owned brand with 20+ years of experience designing waterproofing systems for balconies, roofs, wet areas, and below-ground structures.",
    headquarter: "48 Weaver Street, Coopers Plains QLD 4108.",
    backgroundColor: "#EBD1D9",
    color: "#CD163F",
    applicationAreas: [
      { name: "Roof", slug: "roof", image: "/areas/roof.jpg" },
      { name: "Wall", slug: "wall", image: "/areas/wall.jpg" },
      { name: "Foundation", slug: "foundation", image: "/areas/foundation.jpg" },
      { name: "Civil Works", slug: "civil-works", image: "/areas/civil.jpg" },
    ],
  },
  {
    name: "Enduroflex",
    slug: "enduroflex",
    href: "/systems/enduroflex",
    logo: "/logo-enduroflex.webp",
    overview: "Australia’s top provider of insulation and waterproofing solutions for residential, commercial, and infrastructure projects, supporting energy efficiency and compliance.",
    headquarter: "16/5 Ponderosa Parade, Warriewood NSW 2102.",
    backgroundColor: "#E0E4DC",
    color: "#5E8638",
    applicationAreas: [
      { name: "Roof", slug: "roof", image: "/areas/roof.jpg" },
      { name: "Wall", slug: "wall", image: "/areas/wall.jpg" },
      { name: "Foundation", slug: "foundation", image: "/areas/foundation.jpg" },
      { name: "Civil Works", slug: "civil-works", image: "/areas/civil.jpg" },
      { name: "Internal Wet Areas and Direct Stick Tile System", slug: "internal-wet-areas", image: "/areas/wet.jpg" },
    ],
  },
]