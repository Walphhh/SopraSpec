'use client';

const brands = [
  { name: "Allduro", href: "/brand-selection?brand=Allduro" },
  { name: "Bayset", href: "/brand-selection?brand=Bayset" },
  { name: "Enduroflex", href: "/brand-selection?brand=Enduroflex" },
];

export default function BrandGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {brands.map((b) => (
        <a
          key={b.name}
          href={b.href}
          className="rounded-lg border p-6 hover:shadow-md transition"
        >
          <h3 className="font-semibold">{b.name}</h3>
          <p className="text-sm text-gray-600 mt-1">Explore {b.name} systems</p>
        </a>
      ))}
    </div>
  );
}
