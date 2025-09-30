export default function BrandGrid() {
    const brands = ['Allduro', 'Bayset', 'Enduroflex'];
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {brands.map((b) => (
          <a key={b} href={`/brand-selection?brand=${b}`} className="rounded border p-6 hover:bg-blue-50">
            <h3 className="font-medium">{b}</h3>
            <p className="text-sm text-gray-600 mt-1">Explore {b} systems</p>
          </a>
        ))}
      </div>
    );
  }
  