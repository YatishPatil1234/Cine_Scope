import { cookies } from "next/headers";
import MovieCard from "@/components/MovieCard";
import WatchlistButton from "@/components/WatchListButton";
import BackdropImage from "@/components/BackdropImage";
import CastCard from "@/components/CastCard";
import { getLanguageFromCookie } from "@/lib/language";
import { getMovieCredits, getMovieDetails, getSimilarMovies } from "@/lib/tmdb";
import Image from "next/image";

function formatMoney(value) {
  if (!value || value < 1000) return null;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

export default async function MoviePage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);

  const [movie, credits, similar] = await Promise.all([
    getMovieDetails(id, lang),
    getMovieCredits(id, lang),
    getSimilarMovies(id, lang),
  ]);

  const backdropSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const voteAvg = movie.vote_average != null ? movie.vote_average.toFixed(1) : "—";
  const releaseDate = movie.release_date || "—";
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const tagline = movie.tagline?.trim() || null;
  const status = movie.status || null;
  const budgetStr = formatMoney(movie.budget);
  const revenueStr = formatMoney(movie.revenue);

  return (
    <main className="pb-12 sm:pb-20 overflow-x-hidden w-full">
      {/* BACKDROP */}
      <div className="relative h-[40vh] min-h-[240px] sm:min-h-[280px] md:h-[50vh] md:min-h-[320px] w-full overflow-hidden">
        <BackdropImage
          src={backdropSrc}
          alt={movie.title}
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/80 via-[var(--background)]/50 to-[var(--background)]" />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 -mt-28 sm:-mt-32 md:-mt-40 relative z-10 w-full box-border">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10">
          {/* POSTER */}
          <div className="flex-shrink-0 w-full max-w-[240px] sm:max-w-[280px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-border">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 240px, 280px"
                />
              ) : (
                <div className="absolute inset-0 bg-card flex items-center justify-center text-muted-foreground text-5xl sm:text-6xl">
                  🎬
                </div>
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-4 sm:space-y-5 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>⭐ {voteAvg}</span>
              {releaseDate !== "—" && <span>• {releaseDate}</span>}
              {runtime && <span>• {runtime}</span>}
            </div>

            {tagline && (
              <p className="text-foreground/90 italic text-sm sm:text-base">{tagline}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1.5 rounded-full bg-card text-foreground text-sm border border-border"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="max-w-2xl text-muted-foreground leading-relaxed text-sm sm:text-base">
              {movie.overview}
            </p>

            {/* Extra info */}
            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 text-sm">
              {status && (
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="text-foreground font-medium">{status}</p>
                </div>
              )}
              {budgetStr && (
                <div>
                  <span className="text-muted-foreground">Budget</span>
                  <p className="text-foreground font-medium">{budgetStr}</p>
                </div>
              )}
              {revenueStr && (
                <div>
                  <span className="text-muted-foreground">Revenue</span>
                  <p className="text-foreground font-medium">{revenueStr}</p>
                </div>
              )}
            </div>

            <WatchlistButton movie={movie} />
          </div>
        </div>

        {/* CAST */}
        <section className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            Cast
          </h2>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 hide-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
            {(credits.cast || []).slice(0, 12).map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </div>
        </section>

        {/* SIMILAR MOVIES */}
        <section className="mt-12 sm:mt-16 md:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {(similar.results || []).slice(0, 10).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
