'use client';

type Product = { id: string; name: string; category: string };

const mockProducts: Product[] = [
  { id: "1", name: "SOPRAVAP’R", category: "Vapour Barrier" },
  { id: "2", name: "FLAGON SFc", category: "Waterproofing Membrane" },
  { id: "3", name: "ALSAN FLASHING", category: "Sealant" },
];

export default function SelectedProductsList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {mockProducts.map((p) => (
        <div
          key={p.id}
          className="rounded border p-4 hover:shadow-md transition"
        >
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-sm text-gray-600">{p.category}</p>
        </div>
      ))}
    </div>
  );
}
