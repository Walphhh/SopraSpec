import axios from "axios";
import { getBackendUrl } from "@/utils/get-backend-url";
import type {
  AreaType,
  Project,
  ProjectArea,
  ProjectDetail,
  Specification,
  SpecificationStatus,
} from "@/utils/types";

export type CreateProjectPayload = {
  ownerId: string;
  name?: string;
};

const SPEC_STATUSES: SpecificationStatus[] = ["Draft", "Final", "Archived"];

const toString = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
};

const toOptionalString = (value: unknown) => {
  const normalised = toString(value, "");
  return normalised.length > 0 ? normalised : undefined;
};

const toSpecificationStatus = (value: unknown): SpecificationStatus => {
  if (
    typeof value === "string" &&
    SPEC_STATUSES.includes(value as SpecificationStatus)
  ) {
    return value as SpecificationStatus;
  }
  return "Draft";
};

const normaliseSpecificationList = (
  rows: unknown
): Specification[] | undefined => {
  if (!Array.isArray(rows)) return undefined;

  const specs: Specification[] = [];

  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const name = toString(record.name);
    if (!name) continue;

    const areaType = (record.areaType ??
      record.area_type ??
      "roof") as AreaType;

    specs.push({
      name,
      areaType,
      dateCreated: toString(record.dateCreated ?? record.date_created),
      status: toSpecificationStatus(record.status),
      actions: undefined,
    });
  }

  return specs.length > 0 ? specs : undefined;
};

const mapProject = (row: Record<string, unknown>): Project => {
  const thumbnail = toOptionalString(row.thumbnail ?? row.thumbnail_url);
  return {
    id: toString(row.id),
    ownerId: toString(row.owner_id ?? row.ownerId),
    name: toString(row.name),
    architect: toString(row.architect),
    builder: toString(row.builder),
    installer: toString(row.installer),
    consultant: toString(row.consultant),
    preparedBy: toString(row.preparedBy ?? row.prepared_by),
    location: toString(row.location),
    date: toString(row.date),
    notes: toOptionalString(row.notes),
    thumbnail,
  };
};

const mapProjectArea = (row: Record<string, unknown>): ProjectArea => {
  const areaType = (row.area_type ?? row.areaType ?? "roof") as AreaType;
  return {
    id: toString(row.id),
    areaType,
    projectId: toString(row.project_id ?? row.projectId),
    systemStackId: toString(row.system_stack_id ?? row.systemStackId),
    name: toString(row.name),
    drawing: toOptionalString(row.drawing),
    status: toSpecificationStatus(row.status),
    actions: undefined,
    warranties: undefined,
    drawings: undefined,
    systems: undefined,
    specifications: normaliseSpecificationList(row.specifications),
  };
};

export async function fetchProjects(ownerId?: string): Promise<Project[]> {
  const query = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : "";
  const url = getBackendUrl(`/projects${query}`);
  const { data } = await axios.get(url);
  const rows: unknown[] = data?.projects ?? [];
  return rows
    .filter(
      (row): row is Record<string, unknown> =>
        Boolean(row) && typeof row === "object"
    )
    .map(mapProject);
}

export async function fetchProjectById(
  id: string
): Promise<ProjectDetail | null> {
  const url = getBackendUrl(`/projects/${id}`);
  try {
    const { data } = await axios.get(url);
    const row = data?.project;
    if (!row || typeof row !== "object") {
      return null;
    }
    const project = mapProject(row as Record<string, unknown>);

    const rawAreas = (row as Record<string, unknown>).project_areas;
    const areasRows: unknown[] = Array.isArray(rawAreas) ? rawAreas : [];
    const areas = areasRows
      .filter(
        (area): area is Record<string, unknown> =>
          Boolean(area) && typeof area === "object"
      )
      .map(mapProjectArea);
    return { ...project, areas } satisfies ProjectDetail;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400 || status === 404) {
        return null;
      }
    }
    throw error;
  }
}

export async function fetchProjectAreas(
  projectId: string
): Promise<ProjectArea[]> {
  const url = getBackendUrl(`/projects/${projectId}/areas`);
  const { data } = await axios.get(url);
  const rows: unknown[] = data?.project_areas ?? [];
  return rows
    .filter(
      (area): area is Record<string, unknown> =>
        Boolean(area) && typeof area === "object"
    )
    .map(mapProjectArea);
}

export async function createProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const url = getBackendUrl(`/projects`);
  const { data } = await axios.post(url, payload);
  const row = data?.project;
  if (!row || typeof row !== "object") {
    throw new Error("Unexpected response when creating project");
  }
  return mapProject(row as Record<string, unknown>);
}

export async function deleteProject(id: string): Promise<boolean> {
  const url = getBackendUrl(`/projects/${id}`);
  await axios.delete(url);
  return true;
}

export async function createProjectArea(
  projectId: string,
  payload: {
    name: string;
    areaType: AreaType;
    drawing?: string;
    systemStackId?: string;
    status?: SpecificationStatus;
  }
): Promise<ProjectArea> {
  const url = getBackendUrl(`/projects/${projectId}/areas`);
  const { data } = await axios.post(url, {
    name: payload.name,
    areaType: payload.areaType,
    drawing: payload.drawing,
    systemStackId: payload.systemStackId,
    status: payload.status,
  });
  const row = data?.project_area;
  if (!row || typeof row !== "object") {
    throw new Error("Unexpected response when creating project area");
  }
  return mapProjectArea(row as Record<string, unknown>);
}
