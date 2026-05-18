import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CineScope — Discover Movies",
    template: "%s | CineScope",
  },
  description: "Explore trending, popular, upcoming, and top-rated movies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
