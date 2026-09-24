import Image from "next/image";
import Link from "next/link";
import { getAllCategories } from "@/lib/services";

export const metadata = {
  title: "Services | Soothe Aesthetics Clinic",
};

export default async function ServicesPage() {
  const categories = await getAllCategories();

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
            Browse by category to explore treatments. Every service is
            personalized during your consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services/category/${category.slug}`}
              className="group block bg-white border border-nude rounded-2xl overflow-hidden hover:shadow-md hover:border-rose/40 transition"
            >
              {category.image_url && (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-script text-2xl text-rose mb-1">
                  {category.name}
                </h2>
                <p className="text-charcoal/50 text-sm">
                  {category.itemCount} treatment
                  {category.itemCount !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}