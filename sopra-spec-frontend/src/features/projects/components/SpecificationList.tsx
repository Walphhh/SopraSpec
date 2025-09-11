'use client';
type Spec = { id: string; createdAt: string; url?: string };

const mock: Spec[] = [
  { id: 's1', createdAt: '2025-08-27', url: '#' },
  { id: 's2', createdAt: '2025-09-01' },
];

export default function SpecificationList() {
  return (
    <ul className="space-y-2">
      {mock.map((s) => (
        <li key={s.id} className="rounded border p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">Specification {s.id.toUpperCase()}</div>
            <div className="text-sm text-gray-600">Generated: {s.createdAt}</div>
          </div>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1">View</button>
            <button className="rounded border px-3 py-1">Download</button>
            <button className="rounded border px-3 py-1">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
