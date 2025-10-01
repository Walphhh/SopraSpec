import { fetchProjectById } from "@/lib/api/projects";
import WarrantyPage from "./components/Warranty";

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ id: string; areaId: string }>;
}) {
  const { id, areaId } = await params;
  const project = await fetchProjectById(id);
  const area = project?.areas.find((item) => item.id === areaId);

  if (!project || !area) {
    return <div className="p-6 text-red-500">Area not found.</div>;
  }

  return (
    <div className="p-6 text-[#7C878E]">
      <p>
        Area details for{" "}
        <span className="font-semibold text-[#0072CE]">{area.name}</span> will
        appear here.
      </p>

      <WarrantyPage />
    </div>
  );
}
