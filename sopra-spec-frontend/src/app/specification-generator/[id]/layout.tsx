import ProjectSpecNavBar from "@/components/ProjectSpecNavBar"
import { mockProjects } from "@/lib/projects"

export default function SpecLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { id: string }
}) {
    const project = mockProjects.find(p => p.id === params.id)

    if (!project) {
        return <div className="p-4 text-red-500">Project not found</div>
    }

    return (
        <div className="p-2">
            <ProjectSpecNavBar projectId={project.id} projectName={project.name} />
            {children}
        </div>
    )
}
