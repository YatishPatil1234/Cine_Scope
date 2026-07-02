import BackdropImage from "@/components/BackdropImage";
import CastCard from "@/components/CastCard";
import LazyWatchProviders from "@/components/LazyWatchProviders";
import ListsButton from "@/components/ListsButton";
import MediaExtras from "@/components/MediaExtras";
import MovieCard from "@/components/MovieCard";
import MultiRatings from "@/components/MultiRatings";
import RatingWidget from "@/components/RatingWidget";
import ShareButton from "@/components/ShareButton";
import TrackView from "@/components/TrackView";
import TrailerModal from "@/components/TrailerModal";
import { backdropUrl } from "@/lib/images";
import {
  getMovieCollection,
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
} from "@/lib/tmdb";
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
      <TrackView
        id={movie.id}
        title={movie.title}
        poster_path={movie.poster_path}
        vote_average={movie.vote_average}
        release_date={movie.release_date}
        mediaType="movie"
      />

      {/* ── Cinematic backdrop ───────────────────────────── */}
      <div className="relative h-[44vw] min-h-[220px] max-h-[520px] w-full overflow-hidden">
        <BackdropImage src={backdropSrc} alt={movie.title} className="object-cover opacity-50 scale-[1.03]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.3) 40%, rgba(8,8,8,1) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.6) 0%, transparent 60%)" }} />
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="page-container -mt-20 sm:-mt-28 md:-mt-36 relative z-10">

        {/* Poster + Info row */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12">

          {/* Poster */}
          <div className="flex-shrink-0 w-[130px] sm:w-[190px] md:w-[230px] mx-auto sm:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)] border border-white/[0.1]">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fetchPriority="high"
                  decoding="async"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-4xl">🎬</div>
              )}
              {/* Sheen */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)" }} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
            <div>
              {tagline && (
                <p className="italic text-xs sm:text-sm text-zinc-500 mb-2">&ldquo;{tagline}&rdquo;</p>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight leading-[1.07] text-white break-words">
                {movie.title}
              </h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-sm text-zinc-600 mt-1">{movie.original_title}</p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {voteAvg !== "—" && (
                  <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                    ★ {voteAvg}
                  </span>
                )}
                {releaseDate && (
                  <span className="text-xs text-zinc-400 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07]">
                    {releaseDate}
                  </span>
                )}
                {runtime && (
                  <span className="text-xs text-zinc-400 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07]">
                    ⏱ {runtime}
                  </span>
                )}
                {movie.status && movie.status !== "Released" && (
                  <span className="text-xs text-indigo-300 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    {movie.status}
                  </span>
                )}
              </div>
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/[0.09] text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/8 transition-all duration-150"
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

            {/* Multi-source ratings (OMDB) */}
            {movie.imdb_id && <MultiRatings imdbId={movie.imdb_id} />}

            {/* Budget / Revenue */}
            {(budgetStr || revenueStr) && (
              <div className="flex flex-wrap gap-5 sm:gap-8 pt-1">
                {budgetStr && (
                  <div>
                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Budget</p>
                    <p className="text-sm font-bold text-zinc-300">{budgetStr}</p>
                  </div>
                )}
                {revenueStr && (
                  <div>
                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold mb-1">Revenue</p>
                    <p className="text-sm font-bold text-zinc-300">{revenueStr}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <ListsButton movie={movie} mediaType="movie" />
              <TrailerModal videos={videos} />
              <ShareButton title={movie.title} />
            </div>

            {/* Personal rating */}
            <div className="pt-2 max-w-xs">
              <RatingWidget id={movie.id} mediaType="movie" />
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
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar">
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

        <MediaExtras mediaType="movie" id={id} />
      </div>
    </main>
  );
}
