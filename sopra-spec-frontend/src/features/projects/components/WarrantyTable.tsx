'use client';
type Row = { id: string; productName: string; warrantyUrl?: string };

const mock: Row[] = [
  { id: '1', productName: 'SOPRAVAP’R', warrantyUrl: '#' },
  { id: '2', productName: 'FLAGON SFc' },
];

export default function WarrantyTable() {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left border-b">
          <th className="p-2">Product</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {mock.map((r) => (
          <tr key={r.id} className="border-b">
            <td className="p-2">{r.productName}</td>
            <td className="p-2">
              <button className="rounded border px-3 py-1 mr-2">View</button>
              <button className="rounded border px-3 py-1">Download</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
