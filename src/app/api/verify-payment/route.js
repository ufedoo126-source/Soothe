import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const CLINIC_EMAIL = "soothebylore@gmail.com";
const FROM_ADDRESS = "Soothe Aesthetics <onboarding@resend.dev>";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  const body = await request.json();
  const {
    reference,
    email,
    name,
    phone,
    serviceName,
    fullPrice,
    amount,
    paymentType,
    appointmentDate,
    appointmentTime,
  } = body;

  if (!reference) {
    return Response.json(
      { verified: false, error: "No reference provided" },
      { status: 400 }
    );
  }

  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const paystackData = await paystackRes.json();

  const isVerified =
    paystackData.status && paystackData.data.status === "success";

  if (!isVerified) {
    return Response.json({ verified: false }, { status: 400 });
  }

  // Final availability check right before saving, in case someone else
  // grabbed this exact slot in the last few seconds
  const { data: clash } = await supabase
    .from("available_slots")
    .select("appointment_time")
    .eq("appointment_date", appointmentDate)
    .eq("appointment_time", appointmentTime)
    .maybeSingle();

  const slotStatus = clash ? "needs_reschedule" : "confirmed";

  const { error: insertError } = await supabase.from("bookings").insert({
    service: serviceName,
    price: fullPrice,
    payment_type: paymentType,
    amount_paid: amount,
    customer_name: name,
    customer_phone: phone,
    customer_email: email,
    paystack_reference: reference,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    status: slotStatus,
  });

  if (insertError) {
    console.error("Failed to save booking:", insertError);
  }

  const paymentLabel =
    paymentType === "deposit" ? "50% Deposit" : "Full Payment";
  const amountFormatted = `₦${Number(amount).toLocaleString()}`;
  const clashNote = clash
    ? `<p style="color:#c0392b;"><strong>Note:</strong> this exact slot was taken by someone else moments ago — Dr Semi will need to confirm an alternative time with this client.</p>`
    : "";

  // Send customer receipt (don't let email failures block the booking flow)
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Your Soothe Aesthetics Booking Receipt",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #C96F99;">Thank you, ${name}!</h2>
          <p>We've received your payment for <strong>${serviceName}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Service</td>
              <td style="padding: 8px 0; text-align: right;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date</td>
              <td style="padding: 8px 0; text-align: right;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Time</td>
              <td style="padding: 8px 0; text-align: right;">${appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Payment Type</td>
              <td style="padding: 8px 0; text-align: right;">${paymentLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Amount Paid</td>
              <td style="padding: 8px 0; text-align: right;"><strong>${amountFormatted}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Reference</td>
              <td style="padding: 8px 0; text-align: right; font-size: 12px;">${reference}</td>
            </tr>
          </table>
          <p>Dr Semilore will confirm your appointment with you on WhatsApp shortly.</p>
          <p style="color: #999; font-size: 13px; margin-top: 30px;">Soothe Aesthetics Clinic — 33 Okugade Okunneye Street, Mende, Maryland, Lagos</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send customer receipt email:", err);
  }

  // Notify the clinic
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: CLINIC_EMAIL,
      subject: `New Booking: ${serviceName} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #C96F99;">New Booking Received</h2>
          ${clashNote}
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Client Name</td>
              <td style="padding: 8px 0; text-align: right;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Phone</td>
              <td style="padding: 8px 0; text-align: right;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email</td>
              <td style="padding: 8px 0; text-align: right;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Service</td>
              <td style="padding: 8px 0; text-align: right;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date</td>
              <td style="padding: 8px 0; text-align: right;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Time</td>
              <td style="padding: 8px 0; text-align: right;">${appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Payment Type</td>
              <td style="padding: 8px 0; text-align: right;">${paymentLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Amount Paid</td>
              <td style="padding: 8px 0; text-align: right;"><strong>${amountFormatted}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Reference</td>
              <td style="padding: 8px 0; text-align: right; font-size: 12px;">${reference}</td>
            </tr>
          </table>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send clinic notification email:", err);
  }

  return Response.json({
    verified: true,
    amount: paystackData.data.amount / 100,
  });
}