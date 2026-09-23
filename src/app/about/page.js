export const metadata = {
  title: "About | Soothe Aesthetics Clinic",
};

export default function AboutPage() {
  return (
    <main className="bg-ivory">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
            Our Story
          </p>
          <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-4">
            About Soothe
          </h1>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Premium, personalized aesthetics care rooted in expertise and
            genuine attention to every client's skin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
          <div className="relative aspect-square rounded-3xl bg-nude overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-charcoal/30 text-sm text-center px-6">
            <img src="/about/dr.semi.jpeg" alt="Dr Semi's photo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h2 className="font-script text-3xl text-charcoal mb-4">
              Meet Dr Semi
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              Where science meets aesthetics.

Soothe Aesthetics is a Lagos based aesthetic clinic dedicated to helping clients achieve healthier, clearer and more confident skin through personalised, evidence informed aesthetic care.

We specialise in the treatment and management of concerns including acne, hyperpigmentation, acne scarring, uneven skin tone, melasma, signs of ageing and overall skin health

Our approach is centred around understanding each client's skin before recommending treatment. Rather than following a one-size-fits-all approach, we combine professional assessment, targeted treatments and tailored home-care recommendations to create realistic, sustainable results.

Soothe Aesthetics was created to provide a modern, thoughtful approach to aesthetic care, one that prioritises skin health, safety and long-term results

Our Philosophy

Understand the skin. Treat the concern. Protect the skin.

At Soothe Aesthetics, we believe beautiful skin starts with healthy skin, and every treatment should be designed with that principle in mind.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              Every treatment at Soothe begins with a thorough consultation,
              because no two skin journeys are the same — your treatment
              plan is built around your goals, not a one-size-fits-all
              protocol.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-script text-3xl text-rose mb-2">4.7★</p>
            <p className="text-charcoal/70 text-sm">13+ Client Reviews</p>
          </div>
          <div>
            <p className="font-script text-3xl text-rose mb-2">32+</p>
            <p className="text-charcoal/70 text-sm">Personalized Treatments</p>
          </div>
          <div>
            <p className="font-script text-3xl text-rose mb-2">100%</p>
            <p className="text-charcoal/70 text-sm">Tailored Skin Plans</p>
          </div>
        </div>

        <div className="text-center mt-20">
          <a
            href="/book"
            className="inline-block bg-rose hover:bg-blush text-white font-medium px-10 py-4 rounded-full transition-colors"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </main>
  );
}