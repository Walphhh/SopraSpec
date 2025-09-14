"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumn() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter((seg) => seg) // split path into parts, filter empty string

    if(!pathname.startsWith("/systems")) {
        return null
    }

    return (
        <nav className="px-6 py-3 text-sm font-semibold text-[17px]" aria-label="Breadcrumb">
            <ol className="flex items-center">
                <li>
                <Link href="/systems" className="hover:underline">
                    Systems
                </Link>
                </li>

                {segments.slice(1).map((segment, index) => {
                    // skip the first "systems", since we already rendered it
                    const href = "/systems/" + segments.slice(1, index + 2).join("/")
                    const isLast = index === segments.slice(1).length - 1

                return (
                    <li key={href} className="flex items-center space-x-2">
                    {/* Separator */}
                    <span className="px-3 ">{">"}</span> 

                    {/* If it is the last link, just the plain text */}
                    {isLast ? (
                        <span className="text-[#0072CE] capitalize">
                        {decodeURIComponent(segment.replace(/-/g, " "))}
                        </span>
                    ) : (
                        <Link
                        href={href}
                        className="hover:underline capitalize"
                        >
                        {decodeURIComponent(segment.replace(/-/g, " "))}
                        </Link>
                    )}
                    </li>
                );
                })}
            </ol>
        </nav>
    )
}