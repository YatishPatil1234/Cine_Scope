import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLanguageFromCookie } from "@/lib/language";
import "./globals.css";

export const metadata = {
  title: "CineScope — Discover movies worth your time",
  description:
    "Explore trending, popular, upcoming, and top-rated movies. Save favorites and build your watchlist.",
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full">
        <Navbar initialLang={lang} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
