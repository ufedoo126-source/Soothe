"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
} from "lucide-react";

const WHATSAPP_NUMBER = "2349114624762";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-[#FFF9F7] shadow-sm">
      {/* Top contact bar */}
      <div className="bg-[#29252A] text-white text-xs md:text-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 divide-x divide-white/20">
            <span className="flex items-center gap-1.5 pr-4">
              <MapPin size={14} />
              33 Okugade Okunneye Street, Mende, Maryland, Lagos
            </span>
            <a
              href="mailto:soothebylore@gmail.com"
              className="hidden sm:flex items-center gap-1.5 px-4 hover:text-[#E9A0C2] transition"
            >
              <Mail size={14} />
              soothebylore@gmail.com
            </a>
            <a
              href="tel:09114624762"
              className="flex items-center gap-1.5 px-4 hover:text-[#E9A0C2] transition"
            >
              <Phone size={14} />
              09114624762
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 pl-4 hover:text-[#E9A0C2] transition"
            >
              <MessageCircle size={14} />
              +234 911 462 4762
            </a>
          </div>

          {/* Social icons pill */}
          <div className="hidden md:flex items-center gap-2 bg-white rounded-full px-3 py-1.5">
            <a
              href="#"
              aria-label="Instagram"
              className="text-[#29252A] hover:text-[#C96F99] transition"
            >
              <Instagram size={15} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="text-[#29252A] hover:text-[#C96F99] transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
              </svg>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-[#29252A] hover:text-[#C96F99] transition"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Soothe Aesthetics Clinic" width={44} height={44} />
          <span className="font-serif text-xl text-[#29252A]">Soothe</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#29252A] hover:text-[#C96F99] transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/services"
          className="hidden md:inline-block bg-[#E9A0C2] hover:bg-[#C96F99] text-white px-6 py-2 rounded-full transition"
        >
          Book Now
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#29252A]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FFF9F7] px-4 pb-4 flex flex-col gap-3 border-t border-[#C9A98A]/30">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-[#29252A] hover:text-[#C96F99]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/services"
            onClick={() => setMenuOpen(false)}
            className="bg-[#E9A0C2] text-white text-center px-6 py-2 rounded-full mt-2"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}