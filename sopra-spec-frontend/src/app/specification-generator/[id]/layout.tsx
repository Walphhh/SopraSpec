// app/specification-generator/[id]/layout.tsx
import ProjectSpecNavBar from "@/components/ProjectSpecNavBar"

export default function SpecLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { id: string }
}) {
    return (
        <div className="p-2">
            <ProjectSpecNavBar projectId={params.id} />
            {children}
        </div>
    )
}