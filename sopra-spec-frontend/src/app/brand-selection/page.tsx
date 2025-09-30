import PageHeader from "@/features/common/components/PageHeader";
import BrandGrid from "@/features/products/components/BrandGrid";

export default function Page() {
  return (
    <main className="p-6">
      <PageHeader title="Select a Brand" />
      <BrandGrid />
    </main>
  );
}
