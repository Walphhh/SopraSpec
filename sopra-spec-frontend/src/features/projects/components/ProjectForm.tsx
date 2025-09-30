'use client';
import { useState } from 'react';

type Props = { projectId?: string };
type ProjectFormData = { name: string; location: string; architect?: string; builder?: string };

export default function ProjectForm({ projectId }: Props) {
  const [form, setForm] = useState<ProjectFormData>({ name: '', location: '' });
  const isEdit = Boolean(projectId);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: create/update via useProjects()
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-3">
      <input className="w-full rounded border p-2" placeholder="Project Name"
             value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
      <input className="w-full rounded border p-2" placeholder="Location"
             value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}/>
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded border p-2" placeholder="Architect"
               onChange={(e) => setForm({ ...form, architect: e.target.value })}/>
        <input className="rounded border p-2" placeholder="Builder"
               onChange={(e) => setForm({ ...form, builder: e.target.value })}/>
      </div>
      <button className="rounded bg-blue-600 px-4 py-2 text-white">{isEdit ? 'Save Changes' : 'Save Project'}</button>
    </form>
  );
}
