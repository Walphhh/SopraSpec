export type DistributorT = "Allduro" | "Bayset" | "Enduroflex";

export type LayerT =
  | "vapour_control"
  | "insulation"
  | "cap_sheet"
  | "root_barrier";

export type SubstrateT = "existing_metal" | "metal" | "concrete" | "wood";

export type MaterialT = "bitumen" | "synthetic";

export type AttachmentT = "mechanically_fixed" | "self_adhered" | "loose_laid";

export type AreaType =
  | "roof"
  | "wall"
  | "foundation"
  | "civil_work"
  | "internal_wet_area";

type FoundationSubtype = "pre_applied" | "post_applied";

type CivilWorkSubtype = "tunnels" | "bridges_roads" | "hydraulic_work";

export type RoofSubtype = "new_build" | "refurbishment";

// Project
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
