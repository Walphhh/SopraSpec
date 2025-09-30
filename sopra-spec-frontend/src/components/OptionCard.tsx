import Link from "next/link";
import Image from "next/image";

export default function OptionCard({
    href,
    title,
    image,
    fit = "cover",
    optionCount = 1, 
    textOnly = false,
}: {
    href: string;
    title: string;
    image?: string;
    fit?: "cover" | "contain";
    optionCount?: number;
    textOnly?: boolean;
}) {

    // Height logic
    let height: number;
    if (textOnly) {
        height = 150; 
    } else {
        height = optionCount >= 1 && optionCount <= 3 ? 600 : 300;
    }
    
    return (
        <Link href={href} className="group block">
            <div
                className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                style={{ width: 500, height }}
            >
                {/* Image */}
                {image ? (
                    <div className="absolute inset-0">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            style={{ objectFit: fit }}
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gray-200 group-hover:bg-[#0072CE] flex items-center justify-center">
                        <h3 className="text-[#7C878E] group-hover:!text-white">{title}</h3>
                    </div>
                )}

                {/* Hover Overlay */}
                {image && (
                    <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <h3 className="text-center">{title}</h3>
                    </div>
                )}
            </div>
        </Link>
    );
}
