import PageHeader from '@/features/common/components/PageHeader';
import SpecificationList from '@/features/projects/components/SpecificationList';

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return (
    <main className="p-6">
      <PageHeader title="Specification" subtitle={`Project ID: ${params.id}`} />
      <SpecificationList />
    </main>
  );
}
