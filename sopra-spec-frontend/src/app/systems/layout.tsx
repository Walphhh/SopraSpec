import Breadcrumb from "@/components/Breadcrumb"

export default function SystemsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="p-2">
            <Breadcrumb /> 
            {children}
        </div>
    )
}