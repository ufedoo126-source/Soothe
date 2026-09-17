import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const CLINIC_EMAIL = "soothebylore@gmail.com";
const FROM_ADDRESS = "Soothe Aesthetics <onboarding@resend.dev>";

export async function POST(request) {
  const body = await request.json();
  const { reference, email, name, phone, serviceName, amount, paymentType } =
    body;

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

  const paymentLabel =
    paymentType === "deposit" ? "50% Deposit" : "Full Payment";
  const amountFormatted = `₦${Number(amount).toLocaleString()}`;

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
          <p>Dr Semilore will confirm your appointment date and time with you on WhatsApp shortly.</p>
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
          <p>They'll be reaching out on WhatsApp shortly to confirm a date and time.</p>
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