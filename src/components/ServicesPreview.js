import Link from "next/link";
import { getMenuSections, formatPrice } from "@/lib/services";

// Which menu sections each card represents. "link" is the section the
// card opens on /services. "from" lists every section whose cheapest
// service counts toward the "From ₦…" price.
const CARDS = [
  {
    name: "Consultation",
    description: "Start your journey with a personalized assessment.",
    link: "start-here",
    from: ["start-here"],
  },
  {
    name: "Facials",
    description: "Custom facials tailored to your skin's needs.",
    link: "signature-facials",
    from: ["signature-facials", "specialty-facials"],
  },
  {
    name: "Treatment Plans",
    description: "Multi-session plans for acne, aging, and pigmentation.",
    link: "core-programmes",
    from: ["core-programmes"],
  },
  {
    name: "Waxing",
    description: "Smooth, professional waxing services.",
    link: "waxing", // looked up by name below, since its slug comes from the old import
    from: ["waxing"],
  },
  {
    name: "Microneedling",
    description: "Advanced skin renewal and texture treatments.",
    link: "microneedling-menu",
    from: ["microneedling-menu"],
  },
  {
    name: "Chemical Peels",
    description: "Targeted peels for brightening and pigmentation.",
    link: "chemical-peels-menu",
    from: ["chemical-peels-menu"],
  },
];

export default async function ServicesPreview() {
  const sections = await getMenuSections();

  // Waxing keeps its old slug from the Setmore import, so find it by name.
  const waxing = sections.find((s) => /wax/i.test(s.name));
  const slugFor = (slug) => (slug === "waxing" ? waxing?.slug : slug);

  function cheapest(slugs) {
    const prices = sections
      .filter((s) => slugs.map(slugFor).includes(s.slug))
      .flatMap((s) => s.services)
      .map((svc) => Number(svc.price))
      .filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : null;
  }

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
          {CARDS.map((card) => {
            const price = cheapest(card.from);
            const target = slugFor(card.link);
            return (
              <Link
                key={card.name}
                href={target ? `/services#${target}` : "/services"}
                className="block bg-ivory rounded-2xl p-8 border border-champagne/30 hover:border-rose transition-colors"
              >
                <h3 className="font-script text-xl text-charcoal mb-2">
                  {card.name}
                </h3>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
                {price && (
                  <p className="text-[#B0386B] text-sm font-medium">
                    From {formatPrice(price)}
                  </p>
                )}
              </Link>
            );
          })}
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