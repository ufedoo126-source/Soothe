"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const VISIT_STEPS = [
  ["Consultation.", "We review your history, examine your skin, take photographs and explain what is happening and why."],
  ["Your plan.", "You receive a written plan with the treatments, number of visits, timeline, homecare and cost, so there are no surprises."],
  ["Treatment.", "Each treatment is tailored to your skin type and tone, using conservative, safe settings."],
  ["Aftercare.", "You go home with clear instructions and a check-in message from us within 48 hours."],
  ["Progress.", "We photograph and review your progress so you can see what is working."],
];

const PROMISES = [
  "We start gently and increase only when your skin is ready.",
  "We never promise perfect or permanent results; skin is individual and results vary.",
  "We recommend only what your skin truly needs.",
  "Strict hygiene: single-use items and sterile equipment where required.",
  "Your photographs and information stay private and are used only with your written consent.",
];

const BEFORE_YOU_BOOK = [
  "First time with us? Start with a Skin Clarity Consultation. The fee is credited toward your first treatment if you book within 7 days.",
  "Patch tests are recommended for peels and may be required for first-time clients.",
  "Please tell us if you are pregnant or breastfeeding, taking isotretinoin (Roaccutane), have cold sores, or have had recent sun exposure, waxing or other skin treatments.",
];

function formatPrice(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

function ServiceRow({ service, consultSlug }) {
  const price = service.price_label || formatPrice(service.price);

  return (
    <div className="py-5 border-b border-nude last:border-b-0 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <Link
          href={`/services/${service.slug}`}
          className="font-semibold text-black hover:text-rose transition"
        >
          {service.name}
        </Link>
        {service.description && (
          <p className="text-charcoal/70 text-sm mt-1">{service.description}</p>
        )}
        {service.duration && (
          <p className="text-charcoal/50 text-xs mt-2">{service.duration}</p>
        )}
      </div>
      <div className="flex items-center gap-4 md:justify-end">
        <span className="font-bold text-[#B0386B] whitespace-nowrap">
          {price}
        </span>
        {service.bookable ? (
          <Link
            href={`/book?service=${service.slug}`}
            className="bg-rose text-white text-sm px-5 py-2 rounded-full hover:opacity-90 transition whitespace-nowrap"
          >
            Book
          </Link>
        ) : (
          <Link
            href={consultSlug ? `/book?service=${consultSlug}` : "/book"}
            className="border border-rose text-rose text-sm px-5 py-2 rounded-full hover:bg-rose hover:text-white transition whitespace-nowrap"
          >
            Book a consultation
          </Link>
        )}
      </div>
    </div>
  );
}

function Section({ section, consultSlug }) {
  return (
    <section id={section.slug} className="scroll-mt-24 mb-14">
      <h2 className="font-script text-3xl text-black mb-3">{section.name}</h2>
      {section.intro && (
        <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
          {section.intro}
        </p>
      )}
      <div className="bg-white border border-nude rounded-2xl px-5">
        {section.services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
            consultSlug={consultSlug}
          />
        ))}
      </div>
    </section>
  );
}

export default function ServicesExplorer({ sections }) {
  // 0 = welcome only, 1 = consultations shown, 2 = everything shown
  const [stage, setStage] = useState(0);
  const consultRef = useRef(null);
  const othersRef = useRef(null);

  const consultations = sections.find((s) => s.slug === "start-here");
  const others = sections.filter((s) => s.slug !== "start-here");
  const consultSlug = consultations?.services?.[0]?.slug;

  useEffect(() => {
    if (stage === 1 && consultRef.current) {
      consultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (stage === 2 && othersRef.current) {
      othersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage]);

  return (
    <div>
      {/* WELCOME WRITE-UP */}
      <div className="mb-10">
        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
          Welcome
        </p>
        <h1 className="font-script text-4xl md:text-5xl text-black mb-5">
          Skin Science for Skin of Colour
        </h1>
        <p className="text-charcoal/80 leading-relaxed mb-10">
          Welcome to <strong>Soothe Aesthetics</strong>. We treat acne, dark
          marks, melasma, scarring, sensitivity and early signs of ageing with
          careful assessment, gentle science-led treatments and clear
          aftercare. Every plan starts with a conversation, a close look at
          your skin and a written plan, because the right treatment for your
          friend may not be right for you.
        </p>

        <h2 className="font-script text-2xl text-black mb-4">
          How your visit works
        </h2>
        <ol className="space-y-3 mb-10">
          {VISIT_STEPS.map(([title, text], i) => (
            <li key={title} className="flex gap-3 text-charcoal/80">
              <span className="font-bold text-[#B0386B]">{i + 1}.</span>
              <span>
                <strong className="text-black">{title}</strong> {text}
              </span>
            </li>
          ))}
        </ol>

        <div className="bg-white border border-nude rounded-2xl p-6 mb-10">
          <h3 className="font-script text-xl text-black mb-3">Our promises</h3>
          <ul className="space-y-2 text-sm text-charcoal/80 list-disc pl-5">
            {PROMISES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <h2 className="font-script text-2xl text-black mb-4">Before you book</h2>
        <ul className="space-y-2 text-charcoal/80 list-disc pl-5 mb-10">
          {BEFORE_YOU_BOOK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {stage === 0 && (
          <div className="text-center">
            <button
              onClick={() => setStage(consultations ? 1 : 2)}
              className="bg-rose text-white px-10 py-3 rounded-full text-lg hover:opacity-90 transition"
            >
              Start Here
            </button>
            <p className="mt-4 text-sm text-charcoal/60">
              Already know what you are looking for?{" "}
              <button
                onClick={() => setStage(2)}
                className="underline text-[#B0386B]"
              >
                Browse all services
              </button>
            </p>
          </div>
        )}
      </div>

      {/* CONSULTATIONS */}
      {stage >= 1 && consultations && (
        <div ref={consultRef} className="scroll-mt-24">
          <Section section={consultations} consultSlug={consultSlug} />
          {stage === 1 && (
            <div className="text-center mb-14">
              <button
                onClick={() => setStage(2)}
                className="bg-rose text-white px-10 py-3 rounded-full text-lg hover:opacity-90 transition"
              >
                Explore other services
              </button>
            </div>
          )}
        </div>
      )}

      {/* EVERYTHING ELSE */}
      {stage >= 2 && (
        <div ref={othersRef} className="scroll-mt-24">
          <div className="flex flex-wrap gap-2 mb-10">
            {others.map((s) => (
              <a
                key={s.id}
                href={`#${s.slug}`}
                className="text-sm border border-nude bg-white rounded-full px-4 py-1.5 text-charcoal/70 hover:border-rose hover:text-rose transition"
              >
                {s.name}
              </a>
            ))}
          </div>
          {others.map((section) => (
            <Section
              key={section.id}
              section={section}
              consultSlug={consultSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
}