"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const POLICY_SECTIONS = [
  {
    title: "Appointments",
    body: "All appointments must be booked in advance. Your appointment is only confirmed once the required booking fee has been received.",
  },
  {
    title: "Booking Fee",
    body: "A non-refundable booking fee is required to secure your appointment. The fee will be deducted from the total cost of your treatment.",
  },
  {
    title: "Rescheduling & Cancellations",
    body: "We understand that plans can change. If you need to reschedule, please notify us at least 24 hours before your appointment. Appointments cancelled or rescheduled with less than 24 hours' notice may result in the loss of your booking fee, and a new booking fee may be required for another appointment.",
  },
  {
    title: "Late Arrivals",
    body: "Please arrive on time for your appointment. Arriving late may reduce your treatment time to avoid inconveniencing clients booked after you. In some cases, appointments may need to be rescheduled.",
  },
  {
    title: "No-Shows",
    body: "Failure to attend an appointment without prior notice will be considered a no-show. No-show appointments forfeit the booking fee, and a new fee will be required for future bookings.",
  },
  {
    title: "Consultation & Skincare Products",
    body: "If you are booking a skin consultation, please come with all skincare products you currently use or have recently been using, including cleansers, moisturisers, serums, treatments, sunscreens and prescription products where applicable. Having your products available allows us to properly assess your current routine and make more informed recommendations.",
  },
  {
    title: "Treatment Suitability",
    body: "Not every treatment is suitable for every client. A consultation or assessment may be required before certain treatments are performed. We reserve the right to postpone or modify a treatment where necessary to prioritise your safety and skin health.",
  },
  {
    title: "Children & Additional Guests",
    body: "To maintain a calm and comfortable environment, we kindly ask that clients avoid bringing children or additional guests unless necessary.",
  },
  {
    title: "By Booking",
    body: "By scheduling an appointment with Soothe Aesthetics, you acknowledge and agree to our booking policy.",
  },
];

export default function BookingPolicy() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-nude rounded-2xl overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 bg-nude/20 hover:bg-nude/30 transition"
      >
        <span className="text-charcoal font-medium text-sm">
          Booking Policy
        </span>
        {expanded ? (
          <ChevronUp size={18} className="text-charcoal/60" />
        ) : (
          <ChevronDown size={18} className="text-charcoal/60" />
        )}
      </button>

      {expanded && (
        <div className="px-5 py-5 space-y-4 max-h-80 overflow-y-auto text-sm">
          <p className="text-charcoal/70">
            At Soothe Aesthetics, we value your time and ours. Please take a
            moment to review our booking policy before scheduling your
            appointment.
          </p>
          {POLICY_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-charcoal font-medium mb-1">
                {section.title}
              </p>
              <p className="text-charcoal/70 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
          <p className="text-charcoal/70 italic pt-2 border-t border-nude/50">
            Thank you for choosing Soothe Aesthetics. We look forward to
            welcoming you.
          </p>
        </div>
      )}
    </div>
  );
}