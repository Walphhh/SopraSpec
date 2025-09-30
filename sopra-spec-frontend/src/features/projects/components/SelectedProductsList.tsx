'use client';
type Item = { id: string; name: string };

const mock: Item[] = [
  { id: 'a', name: 'SOPRAVAP’R' },
  { id: 'b', name: 'FLAGON EP/PR F' },
];

export default function SelectedProductsList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {mock.map((i) => (
        <div key={i.id} className="rounded border p-4 flex items-center justify-between">
          <div className="font-medium">{i.name}</div>
          <button className="rounded border px-2 py-1">Remove</button>
        </div>
      ))}
      <div className="col-span-full flex gap-3">
        <a className="rounded bg-gray-200 px-4 py-2" href="/home">Add More Products</a>
        <button className="rounded bg-blue-600 px-4 py-2 text-white">Generate Specification</button>
      </div>
    </div>
  );
}
