"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/tv",       label: "TV Shows" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/genres",   label: "Genres"   },
  { href: "/search",   label: "Search"   },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn(); // run once on mount
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#080808]/95 backdrop-blur-2xl border-b border-white/[0.07] shadow-2xl shadow-black/40"
            : "bg-[#080808]/70 backdrop-blur-xl border-b border-white/[0.04]"
        }`}
      >
        <div className="page-container h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="text-base font-extrabold tracking-tight text-white shrink-0 hover:opacity-90 transition-opacity"
          >
            Cine<span className="text-indigo-400">Scope</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? "text-white bg-white/[0.08]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]"
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-indigo-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block shrink-0">
            <Link href="/watchlist">
              <span className="inline-flex items-center h-9 px-5 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg shadow-indigo-950/40">
                Watchlist
              </span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer panel — slides down from top */}
        <div
          className={`absolute top-14 left-0 right-0 bg-[#0a0a0a] border-b border-white/[0.07] shadow-2xl shadow-black/60 transition-all duration-300 ${
            open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <nav className="page-container py-5 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center text-base font-semibold px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "text-white bg-white/[0.07] border-l-2 border-indigo-500 pl-[10px]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="page-container pb-5">
            <Link
              href="/watchlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center h-11 w-full rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
            >
              Watchlist
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
