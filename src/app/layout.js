import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getLanguageFromCookie } from "@/lib/language";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata = {
  title: {
    default: "CineScope — Discover Movies",
    template: "%s | CineScope",
  },
  description: "Explore trending, popular, upcoming, and top-rated movies.",
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
