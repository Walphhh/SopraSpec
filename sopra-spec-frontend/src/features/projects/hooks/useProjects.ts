'use client';
import { Project, ProjectDetail } from '@/features/common/types';
import { mockProjects, mockProjectDetails } from '@/lib/projects';

function buildProject(partial: Partial<Project>): Project {
  return {
    id: partial.id ?? 'new-project',
    ownerId: partial.ownerId ?? 'owner-placeholder',
    name: partial.name ?? 'Untitled Project',
    architect: partial.architect ?? '',
    builder: partial.builder ?? '',
    installer: partial.installer ?? '',
    consultant: partial.consultant ?? '',
    preparedBy: partial.preparedBy ?? '',
    location: partial.location ?? '',
    date: partial.date ?? new Date().toISOString().split('T')[0],
    notes: partial.notes,
    thumbnail: partial.thumbnail,
    warranties: partial.warranties ?? [],
  };
}

export function useProjects() {
  // TODO: connect to API/Supabase
  const list = async (): Promise<Project[]> => Promise.resolve(mockProjects);
  const get = async (id: string): Promise<ProjectDetail | null> =>
    Promise.resolve(mockProjectDetails.find((project) => project.id === id) ?? null);
  const create = async (project: Partial<Project>) => Promise.resolve(buildProject(project));
  const update = async (id: string, project: Partial<Project>) => {
    void id;
    void project;
    return Promise.resolve(true);
  };
  return { list, get, create, update };
}
