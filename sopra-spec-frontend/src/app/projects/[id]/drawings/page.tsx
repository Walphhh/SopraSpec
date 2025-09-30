import PageHeader from '@/features/common/components/PageHeader';
import DrawingsUploader from '@/features/projects/components/DrawingsUploader';

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return (
    <main className="p-6 space-y-4">
      <PageHeader title="Drawings / Site Plans" subtitle={`Project ID: ${params.id}`} />
      <DrawingsUploader projectId={params.id} />
    </main>
  );
}
