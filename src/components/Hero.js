import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-ivory">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-rose text-sm tracking-[0.2em] uppercase mb-4">
            Maryland, Lagos
          </p>
          <h1 className="font-script text-4xl md:text-5xl text-charcoal leading-tight mb-6">
            Feel renewed, <span className="text-rose">look radiant</span>
          </h1>
          <p className="text-charcoal/70 text-lg leading-relaxed mb-8 max-w-md">
            Premium medical aesthetics and skincare treatments, tailored to
            you — from facials and chemical peels to advanced treatment
            plans, delivered with care by Dr Semilore.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book"
              className="bg-rose hover:bg-blush text-white font-medium px-8 py-3.5 rounded-full transition-colors"
            >
              Book an Appointment
            </Link>
            <Link
              href="/services"
              className="border border-charcoal/20 hover:border-rose hover:text-rose text-charcoal font-medium px-8 py-3.5 rounded-full transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] rounded-3xl bg-nude overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-charcoal/30 text-sm">
            Clinic / treatment photo goes here
          </div>
        </div>
      </div>
    </section>
  );
}