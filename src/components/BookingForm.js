"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, priceToNumber } from "@/lib/services";
import BookingPayButton from "./BookingPayButton";

const CLINIC_WHATSAPP = "2349114624762";

export default function BookingForm() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("service");
  const service = slug ? getServiceBySlug(slug) : null;

  const [paymentType, setPaymentType] = useState("full");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paid, setPaid] = useState(false);

  if (!service) {
    return (
      <div className="text-center bg-white border border-nude rounded-2xl p-8">
        <p className="text-charcoal/70 mb-4">
          No service selected yet. Head to the services page and pick a
          treatment first.
        </p>
        <Link
          href="/services"
          className="inline-block bg-rose hover:bg-blush text-white font-medium px-6 py-2.5 rounded-full transition"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  const fullPrice = priceToNumber(service.price);
  const amount = paymentType === "deposit" ? Math.round(fullPrice * 0.5) : fullPrice;
  const canPay = name.trim().length > 0 && phone.trim().length >= 10;

  function handlePaySuccess(reference) {
    setPaid(true);

    const message = encodeURIComponent(
      `Hi Dr Semilore, I just paid ₦${amount.toLocaleString()} (${
        paymentType === "deposit" ? "50% deposit" : "full payment"
      }) for ${service.name}. My name is ${name}, phone ${phone}. Payment ref: ${
        reference.reference
      }. Can we fix a date and time?`
    );

    window.location.href = `https://wa.me/${CLINIC_WHATSAPP}?text=${message}`;
  }

  return (
    <div className="bg-white border border-nude rounded-2xl p-6 md:p-8">
      <p className="text-rose text-sm tracking-[0.2em] uppercase mb-2">
        {service.category}
      </p>
      <h2 className="text-2xl text-charcoal font-medium mb-1">
        {service.name}
      </h2>
      <p className="text-charcoal/50 text-sm mb-6">{service.duration}</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setPaymentType("full")}
          className={`py-3 rounded-xl border text-sm font-medium transition ${
            paymentType === "full"
              ? "bg-rose text-white border-rose"
              : "border-nude text-charcoal/70"
          }`}
        >
          Full Payment
          <br />₦{fullPrice.toLocaleString()}
        </button>
        <button
          type="button"
          onClick={() => setPaymentType("deposit")}
          className={`py-3 rounded-xl border text-sm font-medium transition ${
            paymentType === "deposit"
              ? "bg-rose text-white border-rose"
              : "border-nude text-charcoal/70"
          }`}
        >
          50% Deposit
          <br />₦{Math.round(fullPrice * 0.5).toLocaleString()}
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-nude rounded-lg px-4 py-2.5 text-charcoal"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">
            WhatsApp Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-nude rounded-lg px-4 py-2.5 text-charcoal"
            placeholder="e.g. 08012345678"
          />
        </div>
      </div>

      {canPay ? (
        <BookingPayButton
          amount={amount}
          phone={phone}
          name={name}
          onSuccess={handlePaySuccess}
        />
      ) : (
        <button
          type="button"
          disabled
          className="w-full bg-nude text-charcoal/40 font-medium py-3 rounded-lg cursor-not-allowed"
        >
          Enter your name and number to continue
        </button>
      )}

      {paid && (
        <p className="text-center text-sm text-charcoal/60 mt-4">
          Redirecting you to WhatsApp...
        </p>
      )}
    </div>
  );
}