export interface NewProject {
  id: string;
  name: string;
  architect: string;
  builder: string;
  installer: string;
  consultant: string;
  preparedBy: string;
  location: string;
  date: string;
  notes?: string;
  thumbnail?: string;
  warranties?: Warranty[];
}

interface Project extends NewProject {
  ownerId: string;
}
interface ProjectArea {
  id: string;
  areaType: AreaType;
  projectId: string;
  systemStackId: string;
  name: string;
  drawing?: string; // url for the drawing
  status: "Draft" | "Final" | "Archived";
  actions?: {
    view?: string;
    download?: string;
    delete?: boolean;
  };
}

export type Warranty = {
  name: string;
  warrantyPeriod: string;
  issueDate: string;
  expiryDate: string;
  status: "Active" | "Expired";
  actions?: {
    view?: string;
    download?: string;
  }; // URLs for view/download
};

type AreaType =
  | "roof"
  | "wall"
  | "foundation"
  | "civil_work"
  | "internal_wet_area";

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
          download: "/files/roofing-warranty.pdf",
        },
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf",
        },
      },
    ],
    systems: {
      roof: [{ name: "Roofing System A" }, { name: "Roofing System A123" }],
      wall: [{ name: "Wall System A" }],
      foundation: [],
      civilWork: [],
      internalWetArea: [],
    },
    specifications: [
      {
        name: "Roof Spec",
        dateCreated: "2025-09-25",
        status: "Final",
        actions: {
          view: "/files/roof-spec.pdf",
          download: "/files/roof-spec.pdf",
          delete: true,
        },
      },
      {
        name: "Foundation Spec",
        dateCreated: "2025-09-20",
        status: "Draft",
        actions: {
          view: "/files/foundation-spec.pdf",
          download: "/files/foundation-spec.pdf",
          delete: true,
        },
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
          download: "/files/roofing-warranty.pdf",
        },
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf",
        },
      },
    ],
    systems: {
      roof: [{ name: "Roofing System B" }, { name: "Roofing System Beta" }],
      wall: [{ name: "Wall System B" }],
      foundation: [],
      civilWork: [],
      internalWetArea: [{ name: "Bathroom System B" }],
    },
    specifications: [
      {
        name: "Roof Spec",
        dateCreated: "2025-09-25",
        status: "Final",
        actions: {
          view: "/files/roof-spec.pdf",
          download: "/files/roof-spec.pdf",
          delete: true,
        },
      },
      {
        name: "Foundation Spec",
        dateCreated: "2025-09-20",
        status: "Draft",
        actions: {
          view: "/files/foundation-spec.pdf",
          download: "/files/foundation-spec.pdf",
          delete: true,
        },
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
          download: "/files/roofing-warranty.pdf",
        },
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf",
        },
      },
    ],
    systems: {
      roof: [{ name: "Roofing System C" }, { name: "Roofing System C102" }],
      wall: [{ name: "Wall System C" }],
      foundation: [],
      civilWork: [],
      internalWetArea: [],
    },
    specifications: [
      {
        name: "Roof Spec",
        dateCreated: "2025-09-25",
        status: "Final",
        actions: {
          view: "/files/roof-spec.pdf",
          download: "/files/roof-spec.pdf",
          delete: true,
        },
      },
      {
        name: "Foundation Spec",
        dateCreated: "2025-09-20",
        status: "Draft",
        actions: {
          view: "/files/foundation-spec.pdf",
          download: "/files/foundation-spec.pdf",
          delete: true,
        },
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
          download: "/files/roofing-warranty.pdf",
        },
      },
      {
        systemName: "Foundation System",
        warrantyPeriod: "20 years",
        issueDate: "2000-01-01",
        expiryDate: "2020-01-01",
        status: "Expired",
        actions: {
          view: "/files/roofing-warranty.pdf",
          download: "/files/roofing-warranty.pdf",
        },
      },
    ],
    systems: {
      roof: [{ name: "Roofing System D" }, { name: "Roofing System Delta" }],
      wall: [{ name: "Wall System D" }],
      foundation: [],
      civilWork: [{ name: "Bridge System D" }],
      internalWetArea: [],
    },
    specifications: [
      {
        name: "Roof Spec",
        dateCreated: "2025-09-25",
        status: "Final",
        actions: {
          view: "/files/roof-spec.pdf",
          download: "/files/roof-spec.pdf",
          delete: true,
        },
      },
      {
        name: "Foundation Spec",
        dateCreated: "2025-09-20",
        status: "Draft",
        actions: {
          view: "/files/foundation-spec.pdf",
          download: "/files/foundation-spec.pdf",
          delete: true,
        },
      },
    ],
  },
];
