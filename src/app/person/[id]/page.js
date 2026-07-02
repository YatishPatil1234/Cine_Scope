import BioExpandable from "@/components/BioExpandable";
import MovieCard from "@/components/MovieCard";
import { profileUrl } from "@/lib/images";
import { getPersonDetails, getPersonMovieCredits } from "@/lib/tmdb";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!API_KEY) return [];
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/person/week?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 20).map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

function calculateAge(birthday, deathday) {
  if (!birthday) return null;
  const end  = deathday ? new Date(deathday) : new Date();
  const diff = end.getTime() - new Date(birthday).getTime();
  return Math.floor(diff / 31557600000);
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const person = await getPersonDetails(id);
    if (!person?.name) return { title: "Person — CineScope" };
    return {
      title: `${person.name} — CineScope`,
      description: person.biography?.slice(0, 160) || `${person.name} on CineScope.`,
    };
  } catch {
    return { title: "CineScope" };
  }
}

function getYear(movie) {
  const d = movie.release_date || movie.first_air_date || "";
  return d ? parseInt(d.slice(0, 4), 10) : null;
}

export default async function PersonPage({ params }) {
  const { id } = await params;

  const [person, credits] = await Promise.all([
    getPersonDetails(id),
    getPersonMovieCredits(id),
  ]);

  if (!person || person.success === false) notFound();

  const age        = calculateAge(person.birthday, person.deathday);
  const profileSrc = profileUrl(person.profile_path);

  const allCast = credits.cast ?? [];

  // Known for: top 6 by popularity
  const knownFor = allCast
    .filter((m) => m.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  // Career stats
  const ratedMovies   = allCast.filter((m) => m.vote_average > 0 && m.vote_count > 50);
  const avgRating     = ratedMovies.length
    ? (ratedMovies.reduce((s, m) => s + m.vote_average, 0) / ratedMovies.length).toFixed(1)
    : null;
  const yearsActive   = allCast.map(getYear).filter(Boolean);
  const firstYear     = yearsActive.length ? Math.min(...yearsActive) : null;
  const latestYear    = yearsActive.length ? Math.max(...yearsActive) : null;
  const activeYears   = firstYear && latestYear && firstYear !== latestYear
    ? `${firstYear} – ${latestYear}`
    : firstYear ? String(firstYear) : null;

  // Filmography timeline: sort by year desc, group by year
  const filmographyAll = allCast
    .slice()
    .sort((a, b) => {
      const ya = getYear(a) ?? 0;
      const yb = getYear(b) ?? 0;
      return yb - ya;
    });

  const byYear = filmographyAll.reduce((acc, movie) => {
    const yr = getYear(movie) ?? 0;
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(movie);
    return acc;
  }, {});

  const timelineYears = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <main className="pb-24 overflow-x-hidden">

      {/* ── Profile ─────────────────────────────────────── */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
        <div className="page-container relative flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12">

          {/* Avatar */}
          <div className="flex-shrink-0 w-[110px] sm:w-[180px] md:w-[220px] mx-auto sm:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60 bg-zinc-900">
              {profileSrc ? (
                <img
                  src={profileSrc}
                  alt={person.name}
                  fetchPriority="high"
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-zinc-600">
                  {person.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight break-words">
                {person.name}
              </h1>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {person.known_for_department && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-300">
                    🎭 {person.known_for_department}
                  </span>
                )}
                {age && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    {person.deathday ? `Lived ${age} yrs` : `Age ${age}`}
                  </span>
                )}
                {person.birthday && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    🎂 {person.birthday}
                  </span>
                )}
                {person.deathday && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    † {person.deathday}
                  </span>
                )}
                {person.place_of_birth && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] max-w-[240px] truncate">
                    📍 {person.place_of_birth}
                  </span>
                )}
              </div>
            </div>

            {/* Career stats */}
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {[
                { label: "Credits",      value: allCast.length },
                { label: "Avg Rating",   value: avgRating ?? "—" },
                { label: "Active",       value: activeYears ?? "—" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-3 text-center">
                  <p className="text-lg font-extrabold text-white leading-none mb-0.5">{stat.value}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {person.biography && <BioExpandable text={person.biography} />}
          </div>
        </div>
      </section>

      <div className="page-container mb-8">
        <div className="divider" />
      </div>

      {/* ── Known For ────────────────────────────────────── */}
      {knownFor.length > 0 && (
        <section className="page-container mb-12">
          <h2 className="section-title mb-1">Known For</h2>
          <p className="text-sm text-zinc-500 mb-4">Top {knownFor.length} most popular credits</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {knownFor.map((movie) => (
              <MovieCard key={`kf-${movie.id}-${movie.credit_id}`} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* ── Filmography Timeline ─────────────────────────── */}
      {timelineYears.length > 0 && (
        <section className="page-container">
          <h2 className="section-title mb-1">Filmography</h2>
          <p className="text-sm text-zinc-500 mb-6">{allCast.length} credits · sorted by year</p>

          <div className="space-y-10">
            {timelineYears.map((yr) => (
              <div key={yr} className="relative pl-6 sm:pl-8">
                {/* Timeline spine */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.07]" />
                {/* Year dot */}
                <div className="absolute left-0 top-1 w-2 h-2 -translate-x-[3px] rounded-full bg-indigo-500 ring-2 ring-zinc-950" />

                {/* Year label */}
                <h3 className="text-base font-extrabold text-indigo-400 mb-3">
                  {yr === 0 ? "Unknown year" : yr}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
                  {byYear[yr].map((movie) => (
                    <MovieCard key={`fm-${movie.id}-${movie.credit_id}`} movie={movie} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
