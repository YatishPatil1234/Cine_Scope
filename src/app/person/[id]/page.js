import BioExpandable from "@/components/BioExpandable";
import MovieCard from "@/components/MovieCard";
import { profileUrl } from "@/lib/images";
import { getPersonDetails, getPersonMovieCredits } from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 86400;

/** Pre-build top trending people pages at deploy time */
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

function calculateAge(birthday) {
  if (!birthday) return null;
  const diff = Date.now() - new Date(birthday).getTime();
  return Math.floor(diff / 31557600000);
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const person = await getPersonDetails(id);
    if (!person?.name) return { title: "Person — CineScope" };
    return {
      title: person.name,
      description: person.biography?.slice(0, 160) || `${person.name} on CineScope.`,
    };
  } catch {
    return { title: "CineScope" };
  }
}

export default async function PersonPage({ params }) {
  const { id } = await params;

  const [person, credits] = await Promise.all([
    getPersonDetails(id),
    getPersonMovieCredits(id),
  ]);

  if (!person || person.success === false) notFound();

  const age         = calculateAge(person.birthday);
  const profileSrc  = profileUrl(person.profile_path);
  const knownFor    = credits.cast?.sort((a, b) => b.popularity - a.popularity).slice(0, 12) ?? [];
  const filmography = credits.cast?.sort((a, b) => b.popularity - a.popularity) ?? [];

  return (
    <main className="pb-20 overflow-x-hidden">

      {/* ── Profile section ──────────────────────────────── */}
      <section className="relative pt-8 pb-10 sm:pt-10 sm:pb-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />

        <div className="page-container relative flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12">

          {/* Avatar */}
          <div className="flex-shrink-0 w-[110px] sm:w-[180px] md:w-[220px] mx-auto sm:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60 bg-zinc-900">
              {profileSrc ? (
                <Image
                  src={profileSrc}
                  alt={person.name}
                  fill
                  priority
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-zinc-600">
                  {person.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight break-words">
                {person.name}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {person.known_for_department && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-300">
                    🎭 {person.known_for_department}
                  </span>
                )}
                {age && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    Age {age}
                  </span>
                )}
                {person.birthday && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08]">
                    {person.birthday}
                  </span>
                )}
                {person.place_of_birth && (
                  <span className="text-xs text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] max-w-[200px] truncate">
                    📍 {person.place_of_birth}
                  </span>
                )}
              </div>
            </div>

            {person.biography && (
              <BioExpandable text={person.biography} />
            )}
          </div>
        </div>
      </section>

      {/* divider */}
      <div className="page-container mb-8">
        <div className="divider" />
      </div>

      {/* ── Known For ────────────────────────────────────── */}
      {knownFor.length > 0 && (
        <section className="page-container mb-10">
          <h2 className="section-title mb-4">Known For</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {knownFor.map((movie) => (
              <MovieCard key={`kf-${movie.id}-${movie.credit_id}`} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* ── Filmography ──────────────────────────────────── */}
      {filmography.length > 0 && (
        <section className="page-container">
          <h2 className="section-title mb-4">Filmography</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5 sm:gap-3">
            {filmography.map((movie) => (
              <MovieCard key={`fm-${movie.id}-${movie.credit_id}`} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
