import BackdropImage from "@/components/BackdropImage";
import CastCard from "@/components/CastCard";
import LazyRecommendations from "@/components/LazyRecommendations";
import LazyWatchProviders from "@/components/LazyWatchProviders";
import MovieCard from "@/components/MovieCard";
import MovieReviews from "@/components/MovieReviews";
import TrailerModal from "@/components/TrailerModal";
import WatchlistButton from "@/components/WatchListButton";
import { backdropUrl } from "@/lib/images";
import {
  getMovieCollection,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
} from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const API_KEY =
      process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!API_KEY) return [];
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 20).map((m) => ({ id: String(m.id) }));
  } catch {
    return [];
  }
}

function formatMoney(value) {
  if (!value || value < 1000) return null;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    if (!movie) return { title: "Movie Not Found — CineScope" };
    const image = backdropUrl(movie.backdrop_path);
    return {
      title: movie.title,
      description:
        movie.overview?.slice(0, 160) || `Discover ${movie.title} on CineScope.`,
      openGraph: {
        title: movie.title,
        description: movie.overview?.slice(0, 160),
        images: image ? [{ url: image }] : [],
      },
    };
  } catch {
    return { title: "CineScope" };
  }
}

export default async function MoviePage({ params }) {
  const { id } = await params;
  const [movie, credits, similar, videos] = await Promise.all([
    getMovieDetails(id),
    getMovieCredits(id),
    getSimilarMovies(id),
    getMovieVideos(id),
  ]);

  // Fetch collection if this movie belongs to one
  const collectionId = movie?.belongs_to_collection?.id;
  const collection   = collectionId
    ? await getMovieCollection(collectionId).catch(() => null)
    : null;

  if (!movie || movie.success === false) notFound();

  const backdropSrc = backdropUrl(movie.backdrop_path);
  const voteAvg     = movie.vote_average != null ? movie.vote_average.toFixed(1) : "—";
  const releaseDate = movie.release_date?.slice(0, 4) || null;
  const runtime     = movie.runtime ? `${movie.runtime} min` : null;
  const tagline     = movie.tagline?.trim() || null;
  const budgetStr   = formatMoney(movie.budget);
  const revenueStr  = formatMoney(movie.revenue);

  return (
    <main className="pb-16 sm:pb-24 overflow-x-hidden w-full">

      {/* ── Backdrop ─────────────────────────────────────── */}
      <div className="relative h-[38vw] min-h-[200px] max-h-[460px] w-full overflow-hidden">
        <BackdropImage src={backdropSrc} alt={movie.title} className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/40 to-[#080808]" />
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="page-container -mt-16 sm:-mt-24 md:-mt-32 relative z-10">

        {/* Poster + Info row */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 md:gap-10">

          {/* Poster */}
          <div className="flex-shrink-0 w-[120px] sm:w-[180px] md:w-[220px] mx-auto sm:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/70 border border-white/[0.08]">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-4xl">🎬</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white break-words">
                {movie.title}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-0.5 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20">
                  ★ {voteAvg}
                </span>
                {releaseDate && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {releaseDate}
                  </span>
                )}
                {runtime && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {runtime}
                  </span>
                )}
                {movie.status && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {movie.status}
                  </span>
                )}
              </div>

              {tagline && (
                <p className="italic text-sm text-zinc-500 mt-2">&ldquo;{tagline}&rdquo;</p>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-zinc-300 hover:border-indigo-500/40 hover:text-white transition-all"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <p className="text-[15px] sm:text-base leading-relaxed text-zinc-300 max-w-2xl">
                {movie.overview}
              </p>
            )}

            {/* Budget / Revenue */}
            {(budgetStr || revenueStr) && (
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {budgetStr && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Budget</p>
                    <p className="text-sm font-semibold text-zinc-300">{budgetStr}</p>
                  </div>
                )}
                {revenueStr && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Revenue</p>
                    <p className="text-sm font-semibold text-zinc-300">{revenueStr}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <WatchlistButton movie={movie} />
              <TrailerModal videos={videos} />
            </div>

            <LazyWatchProviders mediaType="movie" id={id} />
          </div>
        </div>

        {/* ── Collection ───────────────────────────────────── */}
        {collection?.parts?.length > 1 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="section-title mb-1">
              {collection.name}
            </h2>
            <p className="text-sm text-zinc-500 mb-4">
              {collection.parts.length} movies in this collection
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {collection.parts
                .sort((a, b) => {
                  const da = a.release_date || "";
                  const db = b.release_date || "";
                  return da < db ? -1 : da > db ? 1 : 0;
                })
                .map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
            </div>
          </section>
        )}

        {/* ── Cast ─────────────────────────────────────────── */}
        {(credits.cast ?? []).length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="section-title mb-4">Cast</h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {credits.cast.slice(0, 16).map((actor) => (
                <CastCard key={actor.id} actor={actor} />
              ))}
            </div>
          </section>
        )}

        {/* ── Similar ──────────────────────────────────────── */}
        {(similar.results ?? []).length > 0 && (
          <section className="mt-12 sm:mt-14">
            <h2 className="section-title mb-4">Similar Movies</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {similar.results.slice(0, 12).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}

        <LazyRecommendations mediaType="movie" id={id} />
        <MovieReviews movieId={id} />
      </div>
    </main>
  );
}
