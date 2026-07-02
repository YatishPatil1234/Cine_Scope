import Link from "next/link";

const COLUMNS = [
  {
    heading: "Browse",
    links: [
      { href: "/discover", label: "Discover"  },
      { href: "/tv",       label: "TV Shows"  },
      { href: "/genres",   label: "Genres"    },
      { href: "/decades",  label: "By Decade" },
      { href: "/upcoming", label: "Upcoming"  },
    ],
  },
  {
    heading: "For You",
    links: [
      { href: "/mood",   label: "Mood Picker" },
      { href: "/lists",  label: "My Lists"    },
      { href: "/stats",  label: "Your Stats"  },
      { href: "/search", label: "Search"      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 relative overflow-hidden">
      <div className="divider" />

      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full pointer-events-none opacity-60"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
      />

      <div className="page-container relative py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">

          {/* Brand */}
          <div className="md:max-w-[320px]">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
              Cine<span className="text-indigo-400">Scope</span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
              Your modern movie companion. Discover trending films, track what you watch,
              and find your next favorite.
            </p>
            <p className="mt-4 text-xs text-zinc-600">
              Powered by{" "}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-indigo-400 transition-colors font-semibold"
              >
                TMDB
              </a>
              {" "}&{" "}
              <a
                href="https://www.omdbapi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-indigo-400 transition-colors font-semibold"
              >
                OMDb
              </a>
              . For discovery purposes only.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-14 sm:gap-20 md:gap-0 md:justify-between md:flex-1 md:max-w-[420px]">
            {COLUMNS.map((col) => (
              <nav key={col.heading}>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-600 mb-3.5">
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} CineScope. Built with Next.js & Tailwind CSS.
          </p>
          <p className="text-xs text-zinc-700">
            Press <kbd className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-500 font-bold text-[10px]">/</kbd> to search anywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
