import Link from "next/link";

const GENRE_META = {
  28:    { icon: "⚔️",  color: "#ef4444", label: "Action"      },
  35:    { icon: "😂",  color: "#f59e0b", label: "Comedy"      },
  18:    { icon: "🎭",  color: "#6366f1", label: "Drama"       },
  27:    { icon: "👻",  color: "#ec4899", label: "Horror"      },
  878:   { icon: "🚀",  color: "#22d3ee", label: "Sci-Fi"      },
  53:    { icon: "🔪",  color: "#f97316", label: "Thriller"    },
  10749: { icon: "💕",  color: "#e879f9", label: "Romance"     },
  16:    { icon: "🎨",  color: "#34d399", label: "Animation"   },
  99:    { icon: "🎬",  color: "#a78bfa", label: "Documentary" },
  14:    { icon: "🧙",  color: "#818cf8", label: "Fantasy"     },
  12:    { icon: "🗺️",  color: "#fb923c", label: "Adventure"   },
  80:    { icon: "🕵️",  color: "#94a3b8", label: "Crime"       },
};

const ORDER = [28, 35, 18, 27, 878, 53, 10749, 16, 99, 14, 12, 80];

export default function GenreStrip({ genres }) {
  const list = (genres ?? []).filter((g) => ORDER.includes(g.id))
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

  if (list.length === 0) return null;

  return (
    <section className="page-container py-5 sm:py-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-600">
          Browse by genre
        </p>
        <Link href="/genres" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
          All genres →
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {list.map((genre) => {
          const meta = GENRE_META[genre.id];
          return (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="group shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: `${meta?.color ?? "#6366f1"}12`,
                border: `1px solid ${meta?.color ?? "#6366f1"}28`,
                color: meta?.color ?? "#a1a1aa",
              }}
            >
              <span className="text-[14px] leading-none">{meta?.icon ?? "🎞️"}</span>
              <span className="whitespace-nowrap">{genre.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
