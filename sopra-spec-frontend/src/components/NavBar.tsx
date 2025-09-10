"use client" // mark this as client component

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Specification Generator", href: "/specification-generator" },
    { name: "Site Analysis", href: "/site-analysis" },
    { name: "My Account", href: "/my-account" },
  ]

  return (
    <nav className="bg-white px-6 py-3 flex items-center">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo-soprema.png"
          alt="SOPREMA Logo"
          width={200}
          height={57}
        />
      </Link>

      {/* Right: Navigation Tabs */}
      <div className="ml-auto flex space-x-6">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium ${
                isActive
                  ? "text-[#0072CE] font-extrabold text-[18px] hover:underline"   // current page
                  : "text-[#7C878E] font-extrabold text-[18px] hover:underline" // normal links
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
