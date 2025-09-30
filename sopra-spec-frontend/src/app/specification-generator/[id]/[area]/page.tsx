"use client";

import { useParams } from "next/navigation";
// import WarrantySection from "./sections/WarrantySection";
// import DrawingsSection from "./sections/DrawingsSection";
// import SelectedSystemsSection from "./sections/SelectedSystemsSection";
// import SpecificationSection from "./sections/SpecificationSection";

export default function AreaPage() {
  const { id: projectId, area, section } = useParams() as {
    id: string;
    area: string;
    section: "warranty" | "drawings" | "selected-systems" | "specification";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2">{area.toUpperCase()}</h2>

      <div className="border p-4 rounded">
        {/* {section === "warranty" && <WarrantySection projectId={projectId} area={area} />}
        {section === "drawings" && <DrawingsSection projectId={projectId} area={area} />}
        {section === "selected-systems" && <SelectedSystemsSection projectId={projectId} area={area} />}
        {section === "specification" && <SpecificationSection projectId={projectId} area={area} />} */}
      </div>
    </div>
  );
}
