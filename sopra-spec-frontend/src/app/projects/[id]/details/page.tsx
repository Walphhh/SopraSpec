import PageHeader from '@/features/common/components/PageHeader';
import ProjectForm from '@/features/projects/components/ProjectForm';

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return (
    <main className="p-6">
      <PageHeader title={`Project Details`} subtitle={`ID: ${params.id}`} />
      <ProjectForm projectId={params.id} />
    </main>
  );
}
