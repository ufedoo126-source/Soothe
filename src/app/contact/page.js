export const metadata = {
  title: "Contact | Soothe Aesthetics Clinic",
};

export default function ContactPage() {
  return (
    <main className="bg-ivory">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
          Get In Touch
        </p>
        <h1 className="font-script text-4xl md:text-5xl text-charcoal mb-4">
          Contact Us
        </h1>
        <p className="text-charcoal/70 max-w-xl mx-auto mb-14">
          Have a question before booking, or need to reschedule? Reach out —
          we're happy to help.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          <a
            href="https://wa.me/2349114624762"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-nude hover:bg-champagne/30 rounded-2xl p-8 transition-colors"
          >
            <p className="font-script text-2xl text-rose mb-2">WhatsApp</p>
            <p className="text-charcoal/70 text-sm">+234 911 462 4762</p>
          </a>

          <a
            href="mailto:soothebylore@gmail.com"
            className="bg-nude hover:bg-champagne/30 rounded-2xl p-8 transition-colors"
          >
            <p className="font-script text-2xl text-rose mb-2">Email</p>
            <p className="text-charcoal/70 text-sm break-all">
              soothebylore@gmail.com
            </p>
          </a>
        </div>

        <div className="bg-charcoal text-ivory rounded-2xl p-8">
          <p className="font-script text-xl mb-2">Visit the Clinic</p>
          <p className="text-ivory/70 text-sm leading-relaxed">
            33 Okugade Okunneye Street,
            <br />
            Mende, Maryland, Lagos 105102
          </p>
        </div>

        <div className="mt-14">
          <a
            href="/book"
            className="inline-block bg-rose hover:bg-blush text-white font-medium px-10 py-4 rounded-full transition-colors"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </main>
  );
}