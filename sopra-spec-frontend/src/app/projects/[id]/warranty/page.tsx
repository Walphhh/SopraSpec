'use client';

import { useParams } from "next/navigation";
import WarrantyTable from "@/features/projects/components/WarrantyTable";

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Warranty</h1>
      <p className="text-sm text-gray-600 mb-4">Project ID: {id}</p>
      <WarrantyTable />
    </main>
  );
}
