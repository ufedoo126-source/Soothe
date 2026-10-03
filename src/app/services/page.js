import { getMenuSections } from "@/lib/services";
import ServicesExplorer from "@/components/ServicesExplorer";

export const metadata = {
  title: "Services | Soothe Aesthetics Clinic",
};

// Re-fetch from Supabase at most once a minute, so edits made in the
// admin panel show up on the live site without a redeploy.
export const revalidate = 60;

export default async function ServicesPage() {
  const sections = await getMenuSections();

  return (
    <main className="bg-ivory">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <ServicesExplorer sections={sections} />
      </div>
    </main>
  );
}