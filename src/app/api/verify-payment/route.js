export async function POST(request) {
  const { reference } = await request.json();

  if (!reference) {
    return Response.json(
      { verified: false, error: "No reference provided" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  if (data.status && data.data.status === "success") {
    return Response.json({
      verified: true,
      amount: data.data.amount / 100,
    });
  }

  return Response.json({ verified: false }, { status: 400 });
}