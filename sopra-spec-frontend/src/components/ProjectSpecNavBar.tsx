"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProjectSpecNavbarProps {
    projectId?: string
}

export default function ProjectSpecNavBar({ projectId }: ProjectSpecNavbarProps) {
    const pathname = usePathname()

    const links = [
        { name: "All Projects", href: "/specification-generator" },
        { name: "Project Details", href: `/specification-generator/${projectId}/project-details` },
        { name: "Warranty", href: `/specification-generator/${projectId}/warranty` },
        { name: "Drawings", href: `/specification-generator/${projectId}/drawings` },
        { name: "Selected Systems", href: `/specification-generator/${projectId}/selected-systems` },
        { name: "Specification", href: `/specification-generator/${projectId}/specification` },
    ]

    return (
        <nav className="px-6 py-3 flex space-x-6 font-semibold">
            {links.map((link, index) => {
                const isActive = link.href === "/specification-generator"
                    ? pathname === "/specification-generator"
                    : pathname.startsWith(link.href)

                return (
                    <span key={link.href} className="flex items-center space-x-2">
                        <Link
                            href={link.href}
                            className={`text-[17px] hover:underline ${isActive ? "text-[#0072CE]" : "text-[#7C878E]"}`}
                        >
                            {link.name}
                        </Link>
                        {/* Add separator if not the last link */}
                        {index < links.length - 1 && <span className="text-[#7C878E] ml-4 ">|</span>}
                    </span>
                )
            })}
        </nav>
    )
}
