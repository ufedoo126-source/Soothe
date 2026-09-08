import Link from "next/link";

const CATEGORIES = [
  {
    name: "Consultation",
    description: "Start your journey with a personalized assessment.",
    from: "₦15,000",
  },
  {
    name: "Facials",
    description: "Custom facials tailored to your skin's needs.",
    from: "₦45,000",
  },
  {
    name: "Treatment Plans",
    description: "Multi-session plans for acne, aging, and pigmentation.",
    from: "₦80,000",
  },
  {
    name: "Waxing",
    description: "Smooth, professional waxing services.",
    from: "₦5,000",
  },
  {
    name: "Microneedling",
    description: "Advanced skin renewal and texture treatments.",
    from: "₦120,000",
  },
  {
    name: "Chemical Peels",
    description: "Targeted peels for brightening and pigmentation.",
    from: "₦20,000",
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-nude">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
            What We Offer
          </p>
          <h2 className="font-script text-3xl md:text-4xl text-charcoal">
            Our Services
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="bg-ivory rounded-2xl p-8 border border-champagne/30 hover:border-rose transition-colors"
            >
              <h3 className="font-script text-xl text-charcoal mb-2">
                {category.name}
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
                {category.description}
              </p>
              <p className="text-rose text-sm font-medium">
                From {category.from}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-block border border-charcoal/20 hover:border-rose hover:text-rose text-charcoal font-medium px-8 py-3.5 rounded-full transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}