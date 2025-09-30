import PageHeader from '@/features/common/components/PageHeader';
import ProjectForm from '@/features/projects/components/ProjectForm';

export default function Page() {
  return (
    <main className="p-6">
      <PageHeader title="New Project" />
      <ProjectForm />
    </main>
  );
}
