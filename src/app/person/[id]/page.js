import BioExpandable from "@/components/BioExpandable";
import MovieCard from "@/components/MovieCard";
import { getLanguageFromCookie } from "@/lib/language";
import { getPersonDetails, getPersonMovieCredits } from "@/lib/tmdb";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

function calculateAge(birthday) {
  if (!birthday) return null;
  const diff = Date.now() - new Date(birthday).getTime();
  return Math.floor(diff / 31557600000);
}

export default async function PersonPage({ params }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);

  const [person, credits] = await Promise.all([
    getPersonDetails(id, lang),
    getPersonMovieCredits(id, lang),
  ]);

  const age = calculateAge(person.birthday);

  const knownFor = credits.cast
    ?.sort((a, b) => b.popularity - a.popularity)
    ?.slice(0, 6);

  const filmography = credits.cast?.sort((a, b) => b.popularity - a.popularity);

  const profileSrc = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : null;

  if (!person || person.success === false) {
    notFound();
  }

  return (
    <main className="pb-24 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative py-24">
        {/* Subtle Indigo Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-16">
          {/* Profile Image */}
          <div className="w-full max-w-[280px]">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-slate-800 shadow-2xl shadow-black/50">
              {profileSrc ? (
                <Image
                  src={profileSrc}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-4xl">
                  ?
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-10">
            {/* Name + Meta */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
                {person.name}
              </h1>

              <div className="flex flex-wrap gap-4">
                {person.known_for_department && (
                  <div className="px-4 py-2 rounded-full bg-card/60 border border-slate-800 text-sm">
                    🎭 {person.known_for_department}
                  </div>
                )}

                {age && (
                  <div className="px-4 py-2 rounded-full bg-card/60 border border-slate-800 text-sm">
                    🎂 Age {age}
                  </div>
                )}

                {person.birthday && (
                  <div className="px-4 py-2 rounded-full bg-card/60 border border-slate-800 text-sm">
                    📅 {person.birthday}
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="px-4 py-2 rounded-full bg-card/60 border border-slate-800 text-sm">
                    📍 {person.place_of_birth}
                  </div>
                )}
              </div>
            </div>

            {/* Biography */}
            {person.biography && <BioExpandable text={person.biography} />}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-60 mb-20" />

      {/* KNOWN FOR */}
      {knownFor?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-24">
          <h2 className="text-2xl font-bold tracking-tight mb-10">Known For</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {knownFor.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* FILMOGRAPHY */}
      {filmography?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-10">
            Filmography
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filmography.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
