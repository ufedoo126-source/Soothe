import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-script text-2xl mb-3">Soothe</p>
          <p className="text-ivory/60 text-sm leading-relaxed">
            Premium medical aesthetics and skincare in Maryland, Lagos.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium tracking-wide uppercase text-champagne mb-4">
            Quick Links
          </p>
          <nav className="flex flex-col gap-2">
            <Link href="/services" className="text-ivory/70 hover:text-rose text-sm">
              Services
            </Link>
            <Link href="/about" className="text-ivory/70 hover:text-rose text-sm">
              About
            </Link>
            <Link href="/gallery" className="text-ivory/70 hover:text-rose text-sm">
              Gallery
            </Link>
            <Link href="/contact" className="text-ivory/70 hover:text-rose text-sm">
              Contact
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-medium tracking-wide uppercase text-champagne mb-4">
            Visit Us
          </p>
          <p className="text-ivory/70 text-sm leading-relaxed">
            33 Okugade Okunneye Street,
            <br />
            Mende, Maryland, Lagos 105102
          </p>
        </div>

        <div>
          <p className="text-sm font-medium tracking-wide uppercase text-champagne mb-4">
            Book an Appointment
          </p>
          <Link
            href="/book"
            className="inline-block bg-rose hover:bg-blush text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-ivory/40 text-xs">
          © {new Date().getFullYear()} Soothe Aesthetics Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}