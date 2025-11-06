"use client";

import { useCallback } from "react";

import type {
  AreaType,
  Project,
  ProjectArea,
  ProjectDetail,
  SpecificationStatus,
} from "@/utils/types";
import {
  fetchProjects,
  fetchProjectById,
  fetchProjectAreas,
  createProject,
  deleteProject,
  createProjectArea,
} from "@/lib/api/projects";
import type { CreateProjectPayload } from "@/lib/api/projects";

export function useProjects() {
  const list = useCallback(
    (ownerId?: string): Promise<Project[]> => fetchProjects(ownerId),
    []
  );
  const get = useCallback(
    (id: string): Promise<ProjectDetail | null> => fetchProjectById(id),
    []
  );
  const listAreas = useCallback(
    (projectId: string): Promise<ProjectArea[]> => fetchProjectAreas(projectId),
    []
  );
  const create = useCallback(
    (payload: CreateProjectPayload): Promise<Project> => createProject(payload),
    []
  );
  const remove = useCallback(
    (id: string): Promise<boolean> => deleteProject(id),
    []
  );
  const createArea = useCallback(
    (
      projectId: string,
      payload: {
        name: string;
        areaType: AreaType;
        drawing?: string;
        systemStackId?: string;
        status?: SpecificationStatus;
      }
    ): Promise<ProjectArea> => createProjectArea(projectId, payload),
    []
  );

  return { list, get, listAreas, create, remove, createArea };
}
