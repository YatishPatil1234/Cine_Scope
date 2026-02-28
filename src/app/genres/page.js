import { getLanguageFromCookie } from "@/lib/language";
import { getAllGenres } from "@/lib/tmdb";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GenresPage() {
  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);

  const data = await getAllGenres(lang);
  const genres = data?.genres || [];

  if (!genres) {
    notFound();
  }

  return (
    <main className="pb-24 overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-24">
        {/* Subtle Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Browse Genres
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore movies by genre and discover stories that match your mood.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-60 mb-16" />

      {/* GENRE GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
              className="group"
            >
              <div
                className="
                  relative
                  rounded-2xl
                  bg-card/70
                  backdrop-blur-md
                  border border-slate-800
                  p-8
                  text-center
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:border-indigo-500/40
                  hover:shadow-xl hover:shadow-black/30
                "
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition rounded-2xl pointer-events-none" />

                <h2 className="relative text-lg font-semibold tracking-tight">
                  {genre?.name}
                </h2>

                <p className="relative mt-2 text-sm text-muted-foreground">
                  Explore {genre?.name?.toLowerCase()} movies
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
