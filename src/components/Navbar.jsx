"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LANGUAGES } from "@/lib/i18n";
import { setLanguageCookie } from "@/lib/language";

export default function Navbar({ initialLang = "en-US" }) {
  const router = useRouter();

  function handleLanguageChange(langCode) {
    if (langCode === initialLang) return;
    setLanguageCookie(langCode);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 min-w-0 w-full">
        <Link
          href="/"
          className="text-lg sm:text-xl font-bold tracking-tight cursor-pointer text-foreground hover:text-indigo-400 transition-colors duration-200 shrink-0 truncate"
        >
          CineScope
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Content language: which movies to show (English vs Hindi) */}
          <div className="flex rounded-md sm:rounded-lg border border-border bg-card/50 p-0.5">
            {LANGUAGES.map(({ code, shortLabel }) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`cursor-pointer px-2 py-1 sm:px-2.5 sm:py-1.5 rounded text-xs font-medium transition-colors min-w-[2rem] sm:min-w-0 ${
                  initialLang === code
                    ? "bg-indigo-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={code === "en-US" ? "Show English movies" : "Show Hindi movies"}
              >
                {shortLabel}
              </button>
            ))}
          </div>

          <Link href="/search" className="cursor-pointer">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-cardHover cursor-pointer"
            >
              Search
            </Button>
          </Link>
          <Link href="/watchlist" className="cursor-pointer">
            <Button className="bg-indigo-500 hover:bg-indigo-400 text-white cursor-pointer shadow-lg shadow-indigo-500/20">
              Watchlist
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
