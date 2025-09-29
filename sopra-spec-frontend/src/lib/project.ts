export type Project = {
  id: string
  name: string
  thumbnail?: string
  isNew?: boolean
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Project A",
    thumbnail: "", 
    isNew: false,
  },
  {
    id: "2",
    name: "Project B",
    thumbnail: "",
    isNew: false,
  },
  {
    id: "3",
    name: "Project C",
    thumbnail: "",
    isNew: false,
  },
  {
    id: "4",
    name: "Project D",
    thumbnail: "",
    isNew: false,
  },
]
