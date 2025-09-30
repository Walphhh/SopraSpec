'use client';

import { useParams } from "next/navigation";
import SelectedProductsList from "@/features/projects/components/SelectedProductsList";

export default function Page() {
  const { id } = useParams() as { id: string };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Selected Products</h1>
      <p className="text-sm text-gray-600">Project ID: {id}</p>
      <SelectedProductsList />
    </main>
  );
}
