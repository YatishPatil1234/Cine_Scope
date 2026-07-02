import Link from "next/link";

export const metadata = {
  title: "Browse by Decade — CineScope",
  description: "Explore the best movies from every era of cinema.",
};

const DECADES = [
  {
    id: "60s", label: "1960s", from: "1960-01-01", to: "1969-12-31",
    color: "#f59e0b", desc: "New Wave, Spaghetti Westerns, classics of Hollywood",
    icon: "🎞️",
  },
  {
    id: "70s", label: "1970s", from: "1970-01-01", to: "1979-12-31",
    color: "#ef4444", desc: "New Hollywood, Scorsese, Coppola, Spielberg emerge",
    icon: "🕺",
  },
  {
    id: "80s", label: "1980s", from: "1980-01-01", to: "1989-12-31",
    color: "#ec4899", desc: "Blockbusters, action heroes, iconic pop culture",
    icon: "🕹️",
  },
  {
    id: "90s", label: "1990s", from: "1990-01-01", to: "1999-12-31",
    color: "#8b5cf6", desc: "Pulp Fiction, grunge era, indie film explosion",
    icon: "📼",
  },
  {
    id: "00s", label: "2000s", from: "2000-01-01", to: "2009-12-31",
    color: "#3b82f6", desc: "Lord of the Rings, superhero dawn, digital age begins",
    icon: "💿",
  },
  {
    id: "10s", label: "2010s", from: "2010-01-01", to: "2019-12-31",
    color: "#10b981", desc: "MCU explosion, streaming era, social cinema",
    icon: "📱",
  },
  {
    id: "20s", label: "2020s", from: "2020-01-01", to: "2029-12-31",
    color: "#6366f1", desc: "Streaming wars, pandemic cinema, A24 renaissance",
    icon: "🚀",
  },
];

export default function DecadesPage() {
  return (
    <main className="pb-24 overflow-x-hidden">
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="page-container relative">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Browse</p>
          <h1 className="page-heading mb-3">Cinema by Era</h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-md">
            Dive into the best films from every decade of cinema history.
          </p>
        </div>
      </section>

      <section className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DECADES.map((decade) => {
            const href = `/discover?dateFrom=${decade.from}&dateTo=${decade.to}&sort=vote_average.desc`;
            return (
              <Link key={decade.id} href={href} className="group block">
                <div
                  className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${decade.color}15 0%, rgba(0,0,0,0) 70%)`,
                    borderColor: `${decade.color}25`,
                  }}
                >
                  {/* Glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ background: decade.color }}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <span className="text-3xl mb-3 block">{decade.icon}</span>
                      <h2
                        className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2"
                        style={{ color: decade.color }}
                      >
                        {decade.label}
                      </h2>
                      <p className="text-sm text-zinc-400 leading-relaxed max-w-[220px]">
                        {decade.desc}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                      style={{ color: decade.color }}
                    >
                      →
                    </span>
                  </div>

                  <div className="mt-5 pt-4 border-t" style={{ borderColor: `${decade.color}20` }}>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: decade.color }}
                    >
                      Explore films →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
