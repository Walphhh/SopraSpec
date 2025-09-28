import Link from "next/link";
import Image from "next/image";
import type { Distributor } from "@/lib/distributors";

export default function DistributorCard({ dist }: { dist: Distributor }) {
  return (
    <Link href={dist.href} className="block">
      <div
        className="distributor-card"
        style={{
          backgroundColor: dist.backgroundColor,
          ["--dist-color" as any]: dist.color,
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src={dist.logo}
            alt={`${dist.name} logo`}
            width={300}
            height={60}
            className="w-[300px] h-[60px] object-contain"
          />
        </div>

        {/* Details */}
        <div style={{ color: dist.color }}>
          <p>
            <span className="font-bold">Overview:</span> {dist.overview}
          </p>
          <p className="mt-2">
            <span className="font-bold">Headquarter:</span> {dist.headquarter}
          </p>
        </div>
      </div>
    </Link>
  );
}