export type AreaType =
  | "roof"
  | "wall"
  | "foundation"
  | "civil_work"
  | "internal_wet_area"

export type Warranty = {
  name: string
  areaType: AreaType
  warrantyPeriod: string
  issueDate: string
  expiryDate: string
  status: "Active" | "Expired"
  actions?: {
    view?: string
    download?: string
  }
}

export type Drawing = {
  name: string
  url: string
  areaType: AreaType
}

export type System = {
  name: string
  areaType: AreaType
  // TODO: selected products (???)
}

export type Specification = {
  name: string
  areaType: AreaType
  dateCreated: string
  status: "Draft" | "Final" | "Archived"
  actions?: {
    view?: string
    download?: string
    delete?: boolean
  }
}

export interface NewProject {
  id: string
  name: string
  architect: string
  builder: string
  installer: string
  consultant: string
  preparedBy: string
  location: string
  date: string
  notes?: string
  thumbnail?: string
  areas?: {
    [key in AreaType]?: {
      warranties?: Warranty[]
      drawings?: Drawing[]
      systems?: System[]
      specifications?: Specification[]
    }
  } 
}

export interface Project extends NewProject {
  ownerId: string
}

// ----------------- MOCK DATA -----------------

export const mockProjects: Project[] = [
  {
    id: "1",
    ownerId: "userA",
    name: "Project A",
    architect: "Architect A",
    builder: "Builder A",
    installer: "Installer A",
    consultant: "Consultant A",
    preparedBy: "User A",
    location: "Location A",
    date: "2025-09-30",
    notes: "Initial notes for Project A",
    thumbnail: "",
    areas: {
      roof: {
        warranties: [
          {
            name: "Roofing Warranty",
            areaType: "roof",
            warrantyPeriod: "15 years",
            issueDate: "2025-01-01",
            expiryDate: "2040-01-01",
            status: "Active",
            actions: { view: "/warr/roof.pdf", download: "/warr/roof.pdf" },
          },
        ],
        drawings: [{ name: "Roof Plan", url: "", areaType: "roof" }],
        systems: [{ name: "Roofing System A", areaType: "roof" }],
        specifications: [
          {
            name: "Roof Spec",
            areaType: "roof",
            dateCreated: "2025-01-10",
            status: "Draft",
            actions: { view: "/specs/roof.pdf", download: "/specs/roof.pdf", delete: true },
          },
        ],
      },
      wall: {
        warranties: [
          {
            name: "Wall Warranty",
            areaType: "wall",
            warrantyPeriod: "20 years",
            issueDate: "2000-01-01",
            expiryDate: "2020-01-01",
            status: "Expired",
            actions: { view: "/warr/wall.pdf", download: "/warr/wall.pdf" },
          },
        ],
        drawings: [{ name: "Wall Elevation", url: "", areaType: "wall" }],
        systems: [{ name: "Wall System A", areaType: "wall" }],
        specifications: [
          {
            name: "Wall Spec",
            areaType: "wall",
            dateCreated: "2025-01-15",
            status: "Final",
            actions: { view: "/specs/wall.pdf", download: "/specs/wall.pdf", delete: true },
          },
        ],
      },
    },
  },
  {
    id: "2",
    ownerId: "userB",
    name: "Project B",
    architect: "Architect B",
    builder: "Builder B",
    installer: "Installer B",
    consultant: "Consultant B",
    preparedBy: "User B",
    location: "Location B",
    date: "2025-08-15",
    notes: "Initial notes for Project B",
    thumbnail: "",
    areas: {
      foundation: {
        warranties: [
          {
            name: "Foundation Warranty",
            areaType: "foundation",
            warrantyPeriod: "20 years",
            issueDate: "2020-01-01",
            expiryDate: "2040-01-01",
            status: "Active",
            actions: { view: "/warr/foundation.pdf", download: "/warr/foundation.pdf" },
          },
        ],
        drawings: [{ name: "Foundation Plan", url: "", areaType: "foundation" }],
        systems: [{ name: "Foundation System B", areaType: "foundation" }],
        specifications: [
          {
            name: "Foundation Spec",
            areaType: "foundation",
            dateCreated: "2025-02-01",
            status: "Final",
            actions: { view: "/specs/foundation.pdf", download: "/specs/foundation.pdf", delete: true },
          },
        ],
      },
    },
  },
  {
    id: "3",
    ownerId: "userC",
    name: "Project C",
    architect: "Architect C",
    builder: "Builder C",
    installer: "Installer C",
    consultant: "Consultant C",
    preparedBy: "User C",
    location: "Location C",
    date: "2025-07-20",
    notes: "Project C notes",
    thumbnail: "",
    areas: {
      civil_work: {
        drawings: [{ name: "Civil Work Plan", url: "", areaType: "civil_work" }],
        systems: [{ name: "Civil System C", areaType: "civil_work" }],
        specifications: [
          {
            name: "Civil Spec",
            areaType: "civil_work",
            dateCreated: "2025-03-10",
            status: "Draft",
            actions: { view: "/specs/civil.pdf", download: "/specs/civil.pdf", delete: true },
          },
        ],
      },
    },
  },
]
