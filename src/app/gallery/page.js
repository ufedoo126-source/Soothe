import Image from "next/image";

const BEFORE_AFTER_SETS = [
  { before: "/gallery/gallery-3.jpg", after: "/gallery/gallery-2.jpg" },
  { before: "/gallery/gallery-1.jpg", after: "/gallery/gallery-5.jpg" },
  { before: "/gallery/gallery-6.jpg", after: "/gallery/gallery-4.jpg" },
];

export const metadata = {
  title: "Gallery | Soothe Aesthetics Clinic",
};

export default function GalleryPage() {
  return (
    <main className="bg-ivory">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
            Our Work
          </p>
          <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-4">
            Before &amp; After
          </h1>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Real results from some of our clients at Soothe Aesthetics
            Clinic.
          </p>
        </div>

        <div className="space-y-16">
          {BEFORE_AFTER_SETS.map((set, i) => (
            <div key={i}>
              <p className="text-rose text-sm tracking-[0.15em] uppercase text-center mb-6">
                Client {i + 1}
              </p>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-nude">
                    <Image
                      src={set.before}
                      alt={`Client ${i + 1} before`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center text-charcoal/60 text-sm mt-3 uppercase tracking-wide">
                    Before
                  </p>
                </div>
                <div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-nude">
                    <Image
                      src={set.after}
                      alt={`Client ${i + 1} after`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-center text-charcoal/60 text-sm mt-3 uppercase tracking-wide">
                    After
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}