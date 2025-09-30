import PageHeader from '@/features/common/components/PageHeader';
import WarrantyTable from '@/features/projects/components/WarrantyTable';

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return (
    <main className="p-6">
      <PageHeader title="Warranty" subtitle={`Project ID: ${params.id}`} />
      <WarrantyTable />
    </main>
  );
}
