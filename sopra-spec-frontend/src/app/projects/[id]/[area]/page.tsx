"use client";

/* TODO: delete (??) */
import { useParams } from "next/navigation";

export default function AreaPage() {
  const { id: projectId, area, section } = useParams() as {
    id: string;
    area: string;
    section: "warranty" | "drawings" | "selected-systems" | "specification";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2">{area.toUpperCase()}</h2>
    </div>
  );
}
