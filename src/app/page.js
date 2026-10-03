import Hero from "@/components/Hero";
import ServicesPreview from "@/components/ServicesPreview";
export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesPreview />
    </main>
  );
}