import BackdropImage from "@/components/BackdropImage";
import CastCard from "@/components/CastCard";
import MovieCard from "@/components/MovieCard";
import TrailerModal from "@/components/TrailerModal";
import WatchlistButton from "@/components/WatchListButton";
import { getLanguageFromCookie } from "@/lib/language";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieReviews,
  getMovieVideos,
  getSimilarMovies,
} from "@/lib/tmdb";
import { cookies } from "next/headers";
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

  const [movie, credits, similar, videos, reviews] = await Promise.all([
    getMovieDetails(id, lang),
    getMovieCredits(id, lang),
    getSimilarMovies(id, lang),
    getMovieVideos(id, lang),
    getMovieReviews(id, lang),
  ]);

  const backdropSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const voteAvg =
    movie.vote_average != null ? movie.vote_average.toFixed(1) : "—";
  const releaseDate = movie.release_date || "—";
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const tagline = movie.tagline?.trim() || null;
  const status = movie.status || null;
  const budgetStr = formatMoney(movie.budget);
  const revenueStr = formatMoney(movie.revenue);

  return (
    <main className="pb-16 sm:pb-24 overflow-x-hidden w-full">
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 -mt-28 sm:-mt-32 md:-mt-40 relative z-10">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* POSTER */}
          <div className="flex-shrink-0 w-full max-w-[260px] sm:max-w-[300px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-border">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-card flex items-center justify-center text-muted-foreground text-5xl">
                  🎬
                </div>
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-5 flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>⭐ {voteAvg}</span>
              {releaseDate !== "—" && <span>• {releaseDate}</span>}
              {runtime && <span>• {runtime}</span>}
            </div>

            {tagline && <p className="text-foreground/90 italic">{tagline}</p>}

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

            <p className="max-w-2xl text-muted-foreground leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-6 pt-2 text-sm">
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

            <div className="flex gap-4 pt-2">
              <WatchlistButton movie={movie} />
              <TrailerModal videos={videos} />
            </div>
          </div>
        </div>

        {/* CAST */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Cast
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {(credits.cast || []).slice(0, 12).map((actor) => (
              <CastCard key={actor.id} actor={actor} />
            ))}
          </div>
        </section>

        {/* SIMILAR MOVIES */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {(similar.results || []).slice(0, 10).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* REVIEWS (Modern) */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
            Reviews
          </h2>

          {(reviews.results || []).length === 0 ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card">
              <p className="text-muted-foreground">
                No reviews available for this movie.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.results.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="p-8 rounded-2xl bg-card border border-border transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold text-lg">
                        {review.author?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-foreground">
                          {review.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          TMDB User Review
                        </p>
                      </div>
                    </div>

                    {review.author_details?.rating && (
                      <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium">
                        ⭐ {review.author_details.rating}
                      </div>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-4">
                    {review.content}
                  </p>

                  {review.url && (
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition font-medium"
                    >
                      Read full review →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
