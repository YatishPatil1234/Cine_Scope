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
import Link from "next/link";

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
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
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
          <div className="flex-1 space-y-5">
            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-yellow-400 font-medium">
                  ★ {voteAvg}
                </span>

                {releaseDate !== "—" && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{releaseDate}</span>
                  </>
                )}

                {runtime && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{runtime}</span>
                  </>
                )}
              </div>

              {tagline && (
                <p className="italic text-lg text-foreground/80">“{tagline}”</p>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-3">
              {movie.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                  className="px-4 py-1.5 rounded-full text-sm bg-card/60 border border-slate-800 hover:border-indigo-500/40 transition"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Overview */}
            <div className="max-w-3xl">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                {movie.overview}
              </p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm pt-4">
              {status && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <p className="font-semibold text-foreground">{status}</p>
                </div>
              )}

              {budgetStr && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                    Budget
                  </p>
                  <p className="font-semibold text-foreground">{budgetStr}</p>
                </div>
              )}

              {revenueStr && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                    Revenue
                  </p>
                  <p className="font-semibold text-foreground">{revenueStr}</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
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
        <section className="mt-28">
          {/* Section Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-10 opacity-60" />

          {/* Title + Count */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Reviews
            </h2>

            <p className="text-sm text-muted-foreground">
              {(reviews.results || []).length} review
              {(reviews.results || []).length !== 1 ? "s" : ""}
            </p>
          </div>

          {(reviews.results || []).length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-card/60 backdrop-blur-sm border border-slate-800">
              <p className="text-muted-foreground">
                No reviews available for this movie.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {reviews.results.slice(0, 5).map((review) => {
                const formattedDate = review.created_at
                  ? new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null;

                return (
                  <div
                    key={review.id}
                    className="
              group
              relative
              p-10
              rounded-2xl
              bg-card/70
              backdrop-blur-md
              border border-slate-800
              shadow-md shadow-black/20
              transition-all duration-300
              hover:-translate-y-1
              hover:border-indigo-500/30
              hover:shadow-xl hover:shadow-black/30
            "
                  >
                    {/* Top Meta */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold text-lg shrink-0">
                          {review.author?.charAt(0).toUpperCase()}
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold tracking-tight text-foreground">
                            {review.author}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                            <span>TMDB User</span>
                            {formattedDate && (
                              <>
                                <span>•</span>
                                <span>{formattedDate}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {review.author_details?.rating && (
                        <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                          ★ {review.author_details.rating}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <p className="text-base text-muted-foreground leading-relaxed line-clamp-5">
                        {review.content}
                      </p>

                      {/* Fade effect at bottom for cinematic feel */}
                      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent" />
                    </div>

                    {review.url && (
                      <a
                        href={review.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                        inline-flex items-center gap-1
                        mt-8
                        text-sm
                        font-medium
                        text-indigo-400
                        hover:text-indigo-300
                        transition
                        "
                      >
                        Read full review
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
