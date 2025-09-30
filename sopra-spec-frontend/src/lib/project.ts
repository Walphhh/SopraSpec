export type Project = {
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
  isNew?: boolean
  warranties?: Warranty[]
  drawings?: {
    roof: Drawing[]
    wall: Drawing[]
    foundation: Drawing[]
    civilWork: Drawing[]
    internalWetArea: Drawing[]
  }
}

export type Warranty = {
  systemName: string
  warrantyPeriod: string
  issueDate: string
  expiryDate: string
  status: "Active" | "Expired"
  actions?: {
    view?: string
    download?: string
  } // URLs for view/download
}

export type Drawing = {
  name: string
  url: string
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Project A",
    architect: "Architect A",
    builder: "Builder A",
    installer: "Installer A",
    consultant: "Consultant A",
    preparedBy: "User A",
    location: "Location A",
    date: "2025-09-30",
    notes: "Sample notes",
    thumbnail: "",
    isNew: false,
    warranties: [
      {
        systemName: "Roofing System",
        warrantyPeriod: "15 years",
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        status: "Active",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
    ],
  },
  {
    id: "2",
    name: "Project B",
    architect: "Architect B",
    builder: "Builder B",
    installer: "Installer B",
    consultant: "Consultant B",
    preparedBy: "User B",
    location: "Location B",
    date: "2025-09-30",
    notes: "Sample notes",
    thumbnail: "",
    isNew: false,
    warranties: [
      {
        systemName: "Roofing System",
        warrantyPeriod: "15 years",
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        status: "Active",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
    ],
  },
  {
    id: "3",
    name: "Project C",
    architect: "Architect C",
    builder: "Builder C",
    installer: "Installer C",
    consultant: "Consultant C",
    preparedBy: "User C",
    location: "Location C",
    date: "2025-09-30",
    notes: "Sample notes",
    thumbnail: "",
    isNew: false,
    warranties: [
      {
        systemName: "Roofing System",
        warrantyPeriod: "15 years",
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        status: "Active",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
    ],
  },
  {
    id: "4",
    name: "Project D",
    architect: "Architect D",
    builder: "Builder D",
    installer: "Installer D",
    consultant: "Consultant D",
    preparedBy: "User D",
    location: "Location D",
    date: "2025-09-30",
    notes: "Sample notes",
    thumbnail: "",
    isNew: false,
    warranties: [
      {
        systemName: "Roofing System",
        warrantyPeriod: "15 years",
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        status: "Active",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf"
        }
      },
    ],
  },
]
