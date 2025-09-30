import PageHeader from "@/features/common/components/PageHeader";
import SpecificationList from "@/features/projects/components/SpecificationList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // App Router: await params in server component

  return (
    <main className="p-6">
      <PageHeader title="Specification" subtitle={`Project ID: ${id}`} />
      <SpecificationList />
    </main>
  );
}
