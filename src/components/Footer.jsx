import Link from "next/link";

const links = [
  { href: "/discover", label: "Discover" },
  { href: "/tv", label: "TV Shows" },
  { href: "/search", label: "Search" },
  { href: "/genres", label: "Genres" },
  { href: "/watchlist", label: "Watchlist" },
];

export default function Footer() {
  return (
    <footer className="mt-20 relative">
      <div className="divider" />
      <div className="page-container py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-white"
          >
            Cine<span className="text-indigo-400">Scope</span>
          </Link>
          <p className="mt-1.5 text-sm text-zinc-500 leading-snug max-w-[240px]">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-400 transition-colors"
            >
              TMDB
            </a>
            . For discovery purposes only.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[15px] text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
