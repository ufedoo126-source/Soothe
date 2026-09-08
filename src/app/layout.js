import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Soothe Aesthetics Clinic | Maryland, Lagos",
  description: "Premium medical aesthetics and skincare treatments in Maryland, Lagos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans bg-ivory text-charcoal antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}