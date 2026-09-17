import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SERVICE_CATEGORIES, getCategoryBySlug, slugify } from "@/lib/services";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((category) => ({
    slug: slugify(category.name),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} | Soothe Aesthetics Clinic`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="bg-ivory">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-rose text-sm mb-8 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to all categories
        </Link>

        {category.image && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-10">
          {category.name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {category.items.map((item) => (
            <Link
              key={item.name}
              href={`/services/${slugify(item.name)}`}
              className="block bg-white border border-nude rounded-2xl p-5 hover:shadow-md hover:border-rose/40 transition"
            >
              <p className="text-charcoal font-medium mb-1">{item.name}</p>
              <p className="text-charcoal/50 text-sm mb-3">{item.duration}</p>
              <p className="text-rose font-medium">{item.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}