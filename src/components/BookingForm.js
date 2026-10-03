"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/services";
import BookingPolicy from "./BookingPolicy";

const BookingPayButton = dynamic(() => import("./BookingPayButton"), {
  ssr: false,
});

const CLINIC_EMAIL = "soothebylore@gmail.com";
const CLINIC_ADDRESS =
  "33 Okugade Okunneye Street, Mende, Maryland, Lagos";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function getTodayString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function isSunday(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString + "T00:00:00");
  return date.getDay() === 0;
}

function prettyDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("service");

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [consultSlug, setConsultSlug] = useState(null);

  const [paymentType, setPaymentType] = useState("full");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [status, setStatus] = useState("idle"); // idle | verifying | verified | failed

  useEffect(() => {
    if (!slug) {
      setLoadingService(false);
      return;
    }

    async function fetchService() {
      const { data, error } = await supabase
        .from("services")
        .select("*, service_categories(name)")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setService({ ...data, categoryName: data.service_categories?.name });
      }
      setLoadingService(false);
    }

    fetchService();
  }, [slug]);

  // For consultation-only services, find the first consultation to send people to
  useEffect(() => {
    if (!service || service.bookable !== false) return;

    async function fetchConsultation() {
      const { data } = await supabase
        .from("services")
        .select("slug, service_categories!inner(slug)")
        .eq("service_categories.slug", "start-here")
        .order("sort_order")
        .limit(1)
        .maybeSingle();

      if (data) setConsultSlug(data.slug);
    }

    fetchConsultation();
  }, [service]);

  useEffect(() => {
    if (!selectedDate || isSunday(selectedDate)) {
      setBookedSlots([]);
      return;
    }

    async function fetchBookedSlots() {
      setLoadingSlots(true);
      setSelectedTime("");
      const { data, error } = await supabase
        .from("available_slots")
        .select("appointment_time")
        .eq("appointment_date", selectedDate);

      if (!error && data) {
        setBookedSlots(data.map((row) => row.appointment_time));
      }
      setLoadingSlots(false);
    }

    fetchBookedSlots();
  }, [selectedDate]);

  if (loadingService) {
    return (
      <div className="text-center bg-white border border-nude rounded-2xl p-8">
        <p className="text-charcoal/50">Loading...</p>
      </div>
    );
  }

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

  // Services that are arranged after a consultation (kits, memberships, medical-level)
  if (service.bookable === false) {
    return (
      <div className="text-center bg-white border border-nude rounded-2xl p-8">
        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-2">
          {service.categoryName}
        </p>
        <h2 className="text-2xl text-charcoal font-medium mb-4">
          {service.name}
        </h2>
        <p className="text-charcoal/70 mb-6">
          This is arranged after a consultation, so that we can confirm it is
          right for your skin, tone and health. Book a consultation first and
          your written plan will cover it.
        </p>
        <Link
          href={consultSlug ? `/book?service=${consultSlug}` : "/services"}
          className="inline-block bg-rose hover:bg-blush text-white font-medium px-6 py-2.5 rounded-full transition"
        >
          {consultSlug ? "Book a consultation" : "Back to services"}
        </Link>
      </div>
    );
  }

  const fullPrice = service.price;
  const amount =
    paymentType === "deposit" ? Math.round(fullPrice * 0.5) : fullPrice;
  const canPay =
    name.trim().length > 0 &&
    phone.trim().length >= 10 &&
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    selectedDate &&
    selectedTime &&
    !isSunday(selectedDate) &&
    policyAgreed;

  async function handlePaySuccess(reference) {
    setPaymentRef(reference.reference);
    setStatus("verifying");

    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.reference,
          email,
          name,
          phone,
          serviceName: service.name,
          fullPrice,
          amount,
          paymentType,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
        }),
      });
      const data = await res.json();

      if (!data.verified) {
        setStatus("failed");
        return;
      }

      setStatus("verified");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("failed");
    }
  }

  // CONFIRMATION SCREEN (replaces the form after a verified payment)
  if (status === "verified") {
    return (
      <div className="bg-white border border-nude rounded-2xl p-6 md:p-8 text-center">
        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-2">
          Booking confirmed
        </p>
        <h2 className="font-script text-3xl text-black mb-2">
          Thank you, {name.split(" ")[0]}
        </h2>
        <p className="text-charcoal/70 mb-6">
          Your appointment is booked. A confirmation email is on its way to{" "}
          {email}.
        </p>

        <div className="text-left bg-ivory border border-nude rounded-xl p-5 mb-6 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-charcoal/60">Treatment</span>
            <span className="text-black font-medium text-right">
              {service.name}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-charcoal/60">Date</span>
            <span className="text-black font-medium text-right">
              {prettyDate(selectedDate)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-charcoal/60">Time</span>
            <span className="text-black font-medium text-right">
              {selectedTime}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-charcoal/60">
              {paymentType === "deposit" ? "Deposit paid" : "Amount paid"}
            </span>
            <span className="text-[#B0386B] font-bold text-right">
              {formatPrice(amount)}
            </span>
          </div>
          {paymentType === "deposit" && (
            <div className="flex justify-between gap-4">
              <span className="text-charcoal/60">Balance remaining</span>
              <span className="text-black font-medium text-right">
                {formatPrice(fullPrice - amount)}
              </span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-charcoal/60">Payment reference</span>
            <span className="text-black font-medium text-right break-all">
              {paymentRef}
            </span>
          </div>
        </div>

        <p className="text-charcoal/70 text-sm mb-1">
          Please arrive 5-10 minutes early; late arrival may shorten your
          treatment.
        </p>
        <p className="text-charcoal/70 text-sm mb-1">{CLINIC_ADDRESS}</p>
        <p className="text-charcoal/70 text-sm mb-6">
          We will contact you on {phone} if anything about your appointment
          needs to change.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-rose hover:bg-blush text-white font-medium px-6 py-2.5 rounded-full transition"
          >
            Back to home
          </Link>
          <Link
            href="/services"
            className="border border-rose text-rose hover:bg-rose hover:text-white font-medium px-6 py-2.5 rounded-full transition"
          >
            Browse more services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-nude rounded-2xl p-6 md:p-8">
      <p className="text-rose text-sm tracking-[0.2em] uppercase mb-2">
        {service.categoryName}
      </p>
      <h2 className="text-2xl text-charcoal font-medium mb-1">
        {service.name}
      </h2>
      <p className="text-charcoal/50 text-sm mb-6">{service.duration}</p>

      <div className="mb-6">
        <label className="block text-sm text-charcoal/70 mb-1">
          Appointment Date
        </label>
        <input
          type="date"
          min={getTodayString()}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full border border-nude rounded-lg px-4 py-2.5 text-charcoal"
        />
        {isSunday(selectedDate) && (
          <p className="text-red-500 text-sm mt-2">
            We are closed on Sundays, please pick Mon-Sat.
          </p>
        )}
      </div>

      {selectedDate && !isSunday(selectedDate) && (
        <div className="mb-6">
          <label className="block text-sm text-charcoal/70 mb-2">
            Appointment Time
          </label>
          {loadingSlots ? (
            <p className="text-charcoal/50 text-sm">
              Checking availability...
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-lg text-xs font-medium border transition ${
                      isBooked
                        ? "bg-nude/40 text-charcoal/30 border-nude cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-rose text-white border-rose"
                        : "border-nude text-charcoal/70 hover:border-rose"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
          <br />
          {formatPrice(fullPrice)}
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
          <br />
          {formatPrice(Math.round(fullPrice * 0.5))}
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
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-nude rounded-lg px-4 py-2.5 text-charcoal"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">
            Phone Number
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

      <BookingPolicy />

      <label className="flex items-start gap-2 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={policyAgreed}
          onChange={(e) => setPolicyAgreed(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm text-charcoal/70">
          I have read and agree to the booking policy above.
        </span>
      </label>

      {canPay ? (
        <BookingPayButton
          amount={amount}
          email={email}
          name={name}
          onSuccess={handlePaySuccess}
        />
      ) : (
        <button
          type="button"
          disabled
          className="w-full bg-nude text-charcoal/40 font-medium py-3 rounded-lg cursor-not-allowed"
        >
          Complete all fields and agree to the policy to continue
        </button>
      )}

      {status === "verifying" && (
        <p className="text-center text-sm text-charcoal/60 mt-4">
          Confirming your payment...
        </p>
      )}

      {status === "failed" && (
        <p className="text-center text-sm text-red-500 mt-4">
          We could not confirm this payment. If you were charged, please email{" "}
          {CLINIC_EMAIL} with your payment reference ({paymentRef}) and we
          will sort it out.
        </p>
      )}
    </div>
  );
}