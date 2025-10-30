export type AreaType =
  | "roof"
  | "wall"
  | "foundation"
  | "civil_work"
  | "internal_wet_area";

export type WarrantyStatus = "Active" | "Expired";
export type SpecificationStatus = "Draft" | "Final" | "Archived";

export type FileActionLinks = {
  view?: string;
  download?: string;
  delete?: boolean;
};

export interface Warranty {
  name: string;
  areaType: AreaType;
  warrantyPeriod: string;
  issueDate: string;
  expiryDate: string;
  status: WarrantyStatus;
  actions?: Omit<FileActionLinks, "delete">;
}

export interface Drawing {
  name: string;
  url: string;
  areaType: AreaType;
}

export interface System {
  name: string;
  areaType: AreaType;
}

export interface Specification {
  name: string;
  areaType: AreaType;
  dateCreated: string;
  status: SpecificationStatus;
  actions?: FileActionLinks;
}

export interface ProjectArea {
  id: string;
  areaType: AreaType;
  projectId: string;
  systemStackId: string;
  name: string;
  drawing?: string;
  status: SpecificationStatus;
  actions?: FileActionLinks;
  warranties?: Warranty[];
  drawings?: Drawing[];
  systems?: System[];
  specifications?: Specification[];
}

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

export interface Project extends NewProject {
  ownerId: string;
}

export interface ProjectDetail extends Project {
  areas: ProjectArea[];
}
