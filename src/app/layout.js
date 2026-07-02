import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CineScope",
  },
};

export const viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full antialiased">
        <KeyboardShortcuts />
        <Navbar />
        <div className="flex-1 pb-14 md:pb-0">{children}</div>
        <div className="hidden md:block"><Footer /></div>
        <ScrollToTop />
        <BottomNav />
      </body>
    </html>
  );
}
