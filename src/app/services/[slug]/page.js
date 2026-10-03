import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getServiceBySlug,
  getAllServiceSlugs,
  getCategoryBySlug,
  formatPrice,
} from "@/lib/services";

// Re-fetch from Supabase at most once a minute, so price and
// description edits show up without a redeploy.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.name} | Soothe Aesthetics Clinic`,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const isBookable = service.bookable !== false;

  // Services that are arranged after a consultation send people to the
  // first consultation instead of straight to payment.
  let consultSlug = null;
  if (!isBookable) {
    const consultations = await getCategoryBySlug("start-here");
    consultSlug = consultations?.services?.[0]?.slug ?? null;
  }

  const price = service.price_label || formatPrice(service.price);

  return (
    <main className="bg-ivory">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-rose text-sm mb-10 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to all services
        </Link>

        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
          {service.categoryName}
        </p>
        <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-6">
          {service.name}
        </h1>

        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-champagne/40">
          {service.duration && (
            <div>
              <p className="text-charcoal/50 text-xs uppercase tracking-wide mb-1">
                Duration
              </p>
              <p className="text-charcoal font-medium">{service.duration}</p>
            </div>
          )}
          <div>
            <p className="text-charcoal/50 text-xs uppercase tracking-wide mb-1">
              Price
            </p>
            <p className="text-[#B0386B] font-bold">{price}</p>
          </div>
        </div>

        {service.description ? (
          <p className="text-charcoal/80 leading-relaxed whitespace-pre-line mb-12">
            {service.description}
          </p>
        ) : (
          <p className="text-charcoal/50 italic mb-12">
            Full details for this treatment are discussed during your
            consultation.
          </p>
        )}

        {isBookable ? (
          <Link
            href={`/book?service=${service.slug}`}
            className="inline-block bg-rose hover:bg-blush text-white font-medium px-8 py-3 rounded-full transition-colors"
          >
            Book This Treatment
          </Link>
        ) : (
          <div>
            <p className="text-charcoal/70 text-sm mb-4">
              This is arranged after a consultation, so that we can confirm it
              is right for your skin, tone and health.
            </p>
            <Link
              href={consultSlug ? `/book?service=${consultSlug}` : "/services"}
              className="inline-block bg-rose hover:bg-blush text-white font-medium px-8 py-3 rounded-full transition-colors"
            >
              {consultSlug ? "Book a Consultation" : "Back to Services"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}