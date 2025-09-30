'use client';
import Link from 'next/link';

export default function NavBar() {
  const links = [
    { href: '/home', label: 'Home' },
    { href: '/brand-selection', label: 'Products' },
    { href: '/projects/1/specification', label: 'Specification Generator' },
    { href: '#', label: 'Site Analysis' },
    { href: '#', label: 'My Account' },
  ];

  return (
    <nav className="flex gap-4 p-4 border-b">
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="hover:text-blue-600">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
