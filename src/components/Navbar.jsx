"use client";

import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/i18n";
import { setLanguageCookie } from "@/lib/language";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({ initialLang = "en-US" }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLanguageChange(langCode) {
    if (langCode === initialLang) return;
    setLanguageCookie(langCode);
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg shadow-black/40"
          : "bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO WITH GLOW */}
        <Link
          href="/"
          className="relative text-xl font-semibold tracking-tight text-foreground group"
        >
          <span className="relative z-10">
            Cine<span className="text-indigo-500">Scope</span>
          </span>

          {/* Glow */}
          <span className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-60 transition duration-500 text-indigo-500">
            CineScope
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {/* Language Toggle */}
          <div className="flex items-center bg-slate-800/60 rounded-full p-1 backdrop-blur-md">
            {LANGUAGES.map(({ code, shortLabel }) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all ${
                  initialLang === code
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {shortLabel}
              </button>
            ))}
          </div>

          {/* Animated underline links */}
          <NavLink href="/search">Search</NavLink>

          <Link href="/watchlist">
            <Button className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-full px-5 shadow-lg shadow-indigo-500/30">
              Watchlist
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
