import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-16 bg-background">
      {/* Soft top separation without harsh border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-foreground hover:text-indigo-400 transition"
          >
            Cine<span className="text-indigo-500">Scope</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm">
            <FooterLink href="/search">Search</FooterLink>
            <FooterLink href="/genres">Genres</FooterLink>
            <FooterLink href="/watchlist">Watchlist</FooterLink>
          </nav>
        </div>

        {/* Bottom Text */}
        <p className="mt-4 text-xs text-muted-foreground text-center sm:text-left">
          Powered by TMDB. For discovery purposes only.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative text-muted-foreground hover:text-foreground transition"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 transition-all duration-300 hover:w-full" />
    </Link>
  );
}
