export const metadata = {
  title: "Book an Appointment | Soothe Aesthetics Clinic",
};

export default function BookPage() {
  return (
    <main className="bg-ivory">
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-10 text-center">
        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
          Reserve Your Visit
        </p>
        <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-4">
          Book an Appointment
        </h1>
        <p className="text-charcoal/70 max-w-xl mx-auto">
          Select a service and time that works for you. A confirmation will
          be sent once your appointment is booked.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="rounded-3xl overflow-hidden border border-nude shadow-sm">
          <iframe
            src="https://sootheaesthetics.setmore.com/bookings"
            title="Book an appointment with Soothe Aesthetics Clinic"
            className="w-full"
            style={{ height: "800px", border: "none" }}
          />
        </div>
      </div>
    </main>
  );
}