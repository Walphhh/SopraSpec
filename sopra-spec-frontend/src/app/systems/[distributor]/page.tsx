import Building3D from "./components/Building3D";

interface DistributorPageProps {
    params: { distributor: string };
}

export default async function DistributorPage({ params }: DistributorPageProps) {
    const { distributor } = await params;
    return <Building3D distributor={distributor} />;
}