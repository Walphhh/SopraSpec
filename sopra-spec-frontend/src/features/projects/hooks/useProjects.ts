'use client';
import { Project } from '@/features/common/types';

export function useProjects() {
  // TODO: connect to API/Supabase
  const list = async (): Promise<Project[]> => Promise.resolve([]);
  const get = async (_id: string): Promise<Project | null> => Promise.resolve(null);
  const create = async (_p: Partial<Project>) => Promise.resolve({ id: 'new', name: '', location: '' });
  const update = async (_id: string, _p: Partial<Project>) => Promise.resolve(true);
  return { list, get, create, update };
}
