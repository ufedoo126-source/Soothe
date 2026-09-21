"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getServiceBySlug, priceToNumber } from "@/lib/services";
import { supabase } from "@/lib/supabaseClient";

const BookingPayButton = dynamic(() => import("./BookingPayButton"), {
  ssr: false,
});

const CLINIC_WHATSAPP = "2349114624762";

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

export default function BookingForm() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("service");
  const service = slug ? getServiceBySlug(slug) : null;

  const [paymentType, setPaymentType] = useState("full");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | verifying | verified | failed

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
  const amount =
    paymentType === "deposit" ? Math.round(fullPrice * 0.5) : fullPrice;
  const canPay =
    name.trim().length > 0 &&
    phone.trim().length >= 10 &&
    /^\S+@\S+\.\S+$/.test(email.trim()) &&
    selectedDate &&
    selectedTime &&
    !isSunday(selectedDate);

  async function handlePaySuccess(reference) {
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

      const message = encodeURIComponent(
        `Hi Dr Semilore, I just paid ₦${amount.toLocaleString()} (${
          paymentType === "deposit" ? "50% deposit" : "full payment"
        }) for ${service.name} on ${selectedDate} at ${selectedTime}. My name is ${name}, phone ${phone}. Payment ref: ${
          reference.reference
        }. Looking forward to my appointment!`
      );

      window.location.href = `https://wa.me/${CLINIC_WHATSAPP}?text=${message}`;
    } catch (err) {
      setStatus("failed");
    }
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
            We're closed on Sundays — please pick Mon–Sat.
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
          Complete all fields, including date &amp; time, to continue
        </button>
      )}

      {status === "verifying" && (
        <p className="text-center text-sm text-charcoal/60 mt-4">
          Confirming your payment...
        </p>
      )}

      {status === "failed" && (
        <p className="text-center text-sm text-red-500 mt-4">
          We couldn't confirm this payment. If you were charged, please
          contact us on WhatsApp directly with your payment reference.
        </p>
      )}

      {status === "verified" && (
        <p className="text-center text-sm text-charcoal/60 mt-4">
          Payment confirmed — redirecting you to WhatsApp...
        </p>
      )}
    </div>
  );
}