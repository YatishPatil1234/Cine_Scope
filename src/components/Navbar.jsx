"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-slate-800/70 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg shadow-black/40"
          : "bg-background/70 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Cine<span className="text-indigo-500">Scope</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/search">Search</NavLink>
          <NavLink href="/genres">Genres</NavLink>

          <Link href="/watchlist">
            <Button className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-full px-5">
              Watchlist
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground text-lg"
            >
              Search
            </Link>

            <Link
              href="/genres"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground text-lg"
            >
              Genres
            </Link>

            <Link href="/watchlist" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg">
                Watchlist
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative text-muted-foreground hover:text-foreground transition-colors group"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
