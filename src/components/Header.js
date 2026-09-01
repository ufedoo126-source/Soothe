"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-nude">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
  <Image
    src="/logoo.jpeg"
    alt="Soothe Aesthetics Clinic"
    width={140}
    height={140}
    className="w-14 h-14 rounded-full object-cover"
    priority
  />
</Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-charcoal hover:text-rose transition-colors text-sm tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/book"
          className="hidden md:inline-block bg-rose hover:bg-blush text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Book Now
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-charcoal"
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4 bg-ivory border-t border-nude">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-charcoal hover:text-rose text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-rose text-white text-center text-sm font-medium px-6 py-2.5 rounded-full"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}