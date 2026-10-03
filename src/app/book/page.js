import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book an Appointment | Soothe Aesthetics Clinic",
};

export default function BookPage() {
  return (
    <main className="bg-ivory">
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-10 text-center">
        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
          Reserve Your Visit
        </p>
        <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-4">
          Book an Appointment
        </h1>
                    <p className="text-charcoal/70 max-w-xl mx-auto">
              Choose your date and time, then pay in full or secure your slot
              with a 50% deposit. Your appointment is confirmed as soon as your
              payment goes through, and a receipt is sent to your email.
            </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <Suspense fallback={<p className="text-center text-charcoal/50">Loading...</p>}>
          <BookingForm />
        </Suspense>
      </div>
    </main>
  );
}