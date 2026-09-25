"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/services";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("appointment_date", { ascending: true });
    if (!error && data) setBookings(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);
    if (!error) fetchBookings();
  }

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "confirmed", "needs_reschedule", "completed", "cancelled"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filter === f
                  ? "bg-rose text-white border-rose"
                  : "border-nude text-charcoal/60"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          )
        )}
      </div>

      {loading ? (
        <p className="text-charcoal/50">Loading bookings...</p>
      ) : filtered.length === 0 ? (
        <p className="text-charcoal/50">No bookings found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-nude rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-charcoal font-medium">{b.service}</p>
                  <p className="text-charcoal/50 text-sm">
                    {b.customer_name} · {b.customer_phone}
                  </p>
                  <p className="text-charcoal/50 text-sm">
                    {b.customer_email}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    b.status === "needs_reschedule"
                      ? "bg-red-100 text-red-600"
                      : b.status === "confirmed"
                      ? "bg-green-100 text-green-600"
                      : "bg-nude/40 text-charcoal/60"
                  }`}
                >
                  {b.status?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-charcoal/70 mb-3">
                <span>
                  {b.appointment_date} at {b.appointment_time}
                </span>
                <span>
                  {formatPrice(b.amount_paid)} ({b.payment_type})
                </span>
              </div>
              <select
                value={b.status}
                onChange={(e) => updateStatus(b.id, e.target.value)}
                className="text-xs border border-nude rounded-lg px-2 py-1.5"
              >
                <option value="confirmed">Confirmed</option>
                <option value="needs_reschedule">Needs Reschedule</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}