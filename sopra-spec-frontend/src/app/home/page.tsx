import ProjectList from '@/features/projects/components/ProjectList';
import PageHeader from '@/features/common/components/PageHeader';

export default function Page() {
  return (
    <main className="p-6">
      <PageHeader title="All Projects" />
      <ProjectList />
    </main>
  );
}
