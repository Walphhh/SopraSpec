"use client" // mark this as client component

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { name: "Home", href: "/" },
    { name: "Systems", href: "/systems" },
    { name: "Specification Generator", href: "/specification-generator" },
    { name: "Site Analysis", href: "/site-analysis" },
    { name: "My Account", href: "/my-account" },
  ]

  return (
    <nav className="px-6 py-3 flex items-center" aria-label="NavBar">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo-soprema.png"
          alt="SOPREMA Logo"
          width={200}
          height={57}
          priority
        />
      </Link>

      {/* Right: Navigation Tabs */}
      <div className="ml-auto flex space-x-6 font-extrabold">
        {links.map((link) => {
          {/* Highlight if pathname contains the href (including the sub-pages) */}
          const isActive = link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium ${isActive
                  ? "text-[#0072CE] text-[18px] hover:underline"   // active tab
                  : "text-[#7C878E] text-[18px] hover:underline" // inactive tabs
                }`}
            >
              {link.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
