'use client';
import Link from 'next/link';
import { Project } from '@/features/common/types';

const mock: Project[] = [
  { id: '1', name: 'Project A', location: 'Sydney' },
  { id: '2', name: 'Project B', location: 'Melbourne' },
];

export default function ProjectList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {mock.map((p) => (
        <Link key={p.id} href={`/projects/${p.id}/details`}
              className="rounded border p-4 hover:bg-blue-50">
          <div className="font-medium">{p.name}</div>
          <div className="text-sm text-gray-600">{p.location}</div>
        </Link>
      ))}
    </div>
  );
}
