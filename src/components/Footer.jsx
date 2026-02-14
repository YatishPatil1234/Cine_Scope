import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-12 sm:mt-16 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="text-base sm:text-lg font-bold text-foreground hover:text-indigo-400 transition-colors cursor-pointer"
          >
            CineScope
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link
              href="/search"
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Search
            </Link>
            <Link
              href="/watchlist"
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Watchlist
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-muted-foreground text-xs text-center sm:text-left px-0">
          Powered by TMDB. For discovery only; no streaming.
        </p>
      </div>
    </footer>
  );
}
