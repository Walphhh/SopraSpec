"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Breadcrumb() {
    const pathname = usePathname()
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    if (!hydrated || !pathname?.startsWith("/systems")) {
        return null
    }

    const segments = pathname.split("/").filter((seg) => seg) // split path into parts, filter empty string

    if (!pathname.startsWith("/systems")) {
        return null
    }

    const isRoot = segments.length === 1;

    return (
        <nav className="px-6 py-3 text-sm font-semibold text-[17px]" aria-label="Breadcrumb">
            <ol className="flex items-center">
                <li>
                    <Link
                        href="/systems"
                        className={
                            isRoot
                                ? "text-[#0072CE] pointer-events-none" 
                                : "hover:underline text-[#7C878E]"
                        }
                    >
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
                            <span className="px-3 text-[#7C878E]">{">"}</span>

                            {/* If it is the last link, just the plain text */}
                            {isLast ? (
                                <span className="text-[#0072CE] capitalize">
                                    {decodeURIComponent(segment.replace(/-/g, " "))}
                                </span>
                            ) : (
                                <Link
                                    href={href}
                                    className="hover:underline capitalize text-[#7C878E]"
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