import Link from "next/link";
import { SERVICE_CATEGORIES, slugify } from "@/lib/services";

export const metadata = {
  title: "Services | Soothe Aesthetics Clinic",
};

export default function ServicesPage() {
  return (
    <main className="bg-ivory">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
            Treatments
          </p>
          <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-4">
            Our Services
          </h1>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Every treatment is personalized during your consultation. Prices
            below are a guide — final recommendations are made by Dr Semilore
            based on your skin and goals.
          </p>
        </div>

        <div className="space-y-16">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h2 className="font-script text-2xl text-rose mb-6 pb-3 border-b border-champagne/40">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={`/services/${slugify(item.name)}`}
                    className="block bg-white border border-nude rounded-2xl p-5 hover:shadow-md hover:border-rose/40 transition"
                  >
                    <p className="text-charcoal font-medium mb-1">
                      {item.name}
                    </p>
                    <p className="text-charcoal/50 text-sm mb-3">
                      {item.duration}
                    </p>
                    <p className="text-rose font-medium">{item.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}