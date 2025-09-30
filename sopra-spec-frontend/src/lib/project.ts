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
  },
]
