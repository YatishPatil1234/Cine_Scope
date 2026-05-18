import BackdropImage from "@/components/BackdropImage";
import CastCard from "@/components/CastCard";
import LazyRecommendations from "@/components/LazyRecommendations";
import LazyWatchProviders from "@/components/LazyWatchProviders";
import TrailerModal from "@/components/TrailerModal";
import TVCard from "@/components/TVCard";
import TVSeasons from "@/components/TVSeasons";
import { backdropUrl, posterUrl } from "@/lib/images";
import {
  getSimilarTV,
  getTVCredits,
  getTVDetails,
  getTVVideos,
} from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const API_KEY =
      process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!API_KEY) return [];
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, 20).map((s) => ({ id: String(s.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const show = await getTVDetails(id);
    if (!show?.name) return { title: "TV Show Not Found — CineScope" };
    return {
      title: show.name,
      description: show.overview?.slice(0, 160) || `Watch ${show.name} on CineScope.`,
      openGraph: {
        title: show.name,
        description: show.overview?.slice(0, 160),
        images: backdropUrl(show.backdrop_path)
          ? [{ url: backdropUrl(show.backdrop_path) }]
          : [],
      },
    };
  } catch {
    return { title: "CineScope" };
  }
}

export default async function TVDetailPage({ params }) {
  const { id } = await params;

  const [show, credits, similar, videos] = await Promise.all([
    getTVDetails(id),
    getTVCredits(id),
    getSimilarTV(id),
    getTVVideos(id),
  ]);

  if (!show || show.success === false) notFound();

  const backdropSrc = backdropUrl(show.backdrop_path);
  const posterSrc   = posterUrl(show.poster_path);
  const voteAvg     = show.vote_average != null ? show.vote_average.toFixed(1) : "—";
  const firstAirYear = show.first_air_date?.slice(0, 4) || null;
  const seasons  = show.number_of_seasons;
  const episodes = show.number_of_episodes;

  return (
    <main className="pb-16 sm:pb-24 overflow-x-hidden w-full">

      {/* ── Backdrop ─────────────────────────────────────── */}
      <div className="relative h-[38vw] min-h-[200px] max-h-[460px] w-full overflow-hidden">
        <BackdropImage src={backdropSrc} alt={show.name} className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/40 to-[#080808]" />
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="page-container -mt-16 sm:-mt-24 md:-mt-32 relative z-10">

        {/* Poster + Info */}
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 md:gap-10">

          {/* Poster */}
          <div className="flex-shrink-0 w-[120px] sm:w-[180px] md:w-[220px] mx-auto sm:mx-0">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/70 border border-white/[0.08]">
              {posterSrc ? (
                <Image src={posterSrc} alt={show.name} fill priority className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-4xl">📺</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
                TV Series
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white break-words">
                {show.name}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="inline-flex items-center gap-0.5 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-md bg-yellow-400/10 border border-yellow-400/20">
                  ★ {voteAvg}
                </span>
                {firstAirYear && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {firstAirYear}
                  </span>
                )}
                {seasons != null && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {seasons} season{seasons !== 1 ? "s" : ""}
                  </span>
                )}
                {episodes != null && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {episodes} eps
                  </span>
                )}
                {show.status && (
                  <span className="text-xs text-zinc-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.07]">
                    {show.status}
                  </span>
                )}
              </div>

              {show.tagline && (
                <p className="italic text-sm text-zinc-500 mt-2">&ldquo;{show.tagline}&rdquo;</p>
              )}
            </div>

            {/* Genres */}
            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {show.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {show.overview && (
              <p className="text-[15px] sm:text-base leading-relaxed text-zinc-300 max-w-2xl">
                {show.overview}
              </p>
            )}

            <div className="flex flex-wrap gap-2.5 pt-1">
              <TrailerModal videos={videos} />
            </div>

            <LazyWatchProviders mediaType="tv" id={id} />
          </div>
        </div>

        {/* ── Seasons ──────────────────────────────────────── */}
        {(show.seasons?.length ?? 0) > 0 && (
          <section className="mt-12 sm:mt-16">
            <TVSeasons seasons={show.seasons} />
          </section>
        )}

        {/* ── Cast ─────────────────────────────────────────── */}
        {(credits.cast?.length ?? 0) > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="section-title mb-4">Cast</h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {credits.cast.slice(0, 16).map((actor) => (
                <CastCard key={actor.id} actor={actor} />
              ))}
            </div>
          </section>
        )}

        {/* ── Similar shows ────────────────────────────────── */}
        {(similar.results?.length ?? 0) > 0 && (
          <section className="mt-12 sm:mt-14">
            <h2 className="section-title mb-4">Similar Shows</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {similar.results.slice(0, 12).map((s) => (
                <TVCard key={s.id} show={s} />
              ))}
            </div>
          </section>
        )}

        <LazyRecommendations mediaType="tv" id={id} title="You may also like" />
      </div>
    </main>
  );
}
