"use client";

import { usePaystackPayment } from "react-paystack";

export default function BookingPayButton({ amount, email, name, onSuccess }) {
  const config = {
    reference: `soothe_${Date.now()}`,
    email: email,
    amount: amount * 100, // Paystack expects kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handlePay = () => {
    initializePayment({
      onSuccess: (reference) => {
        onSuccess(reference);
      },
      onClose: () => {
        console.log("Payment closed");
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      className="w-full bg-[#C96F99] hover:bg-[#b85e88] text-white font-medium py-3 rounded-lg transition"
    >
      Pay ₦{amount.toLocaleString()}
    </button>
  );
}