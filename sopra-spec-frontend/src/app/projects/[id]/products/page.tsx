import PageHeader from '@/features/common/components/PageHeader';
import SelectedProductsList from '@/features/projects/components/SelectedProductsList';

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return (
    <main className="p-6">
      <PageHeader title="Selected Products" subtitle={`Project ID: ${params.id}`} />
      <SelectedProductsList />
    </main>
  );
}
