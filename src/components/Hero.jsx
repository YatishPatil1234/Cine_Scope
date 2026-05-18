import { backdropUrl } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";

export default function Hero({ featuredMovie = null }) {
  const hasBackdrop = featuredMovie?.backdrop_path;
  const src = backdropUrl(featuredMovie?.backdrop_path);
  const year = featuredMovie?.release_date?.slice(0, 4);
  const rating = featuredMovie?.vote_average?.toFixed(1);

  return (
    <section className="relative w-full min-h-[420px] sm:min-h-[520px] md:min-h-[580px] flex items-end overflow-hidden">
      {/* Backdrop */}
      {hasBackdrop && src ? (
        <>
          <Image
            src={src}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" aria-hidden />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[#080808]" aria-hidden />
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" aria-hidden />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-800/6 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" aria-hidden />
        </>
      )}

      {/* Content */}
      <div className="relative page-container pb-10 sm:pb-16 pt-24 sm:pt-32 w-full animate-fade-up">
        <div className="max-w-xl">
          {hasBackdrop ? (
            <>
              {/* Trending badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  Trending Now
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
                {featuredMovie.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {rating && (
                  <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                    ★ {rating}
                  </span>
                )}
                {year && (
                  <span className="text-zinc-400 text-sm">{year}</span>
                )}
                {featuredMovie.runtime && (
                  <span className="text-zinc-400 text-sm">{featuredMovie.runtime} min</span>
                )}
              </div>

              {featuredMovie.overview && (
                <p className="mt-3 text-zinc-300 text-base sm:text-lg leading-relaxed line-clamp-2 max-w-lg">
                  {featuredMovie.overview}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                <Link href={`/movie/${featuredMovie.id}`}>
                  <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold h-10 px-5 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-950/50 hover:shadow-indigo-500/25">
                    <span>▶</span> Watch now
                  </button>
                </Link>
                <Link href="/discover">
                  <button className="inline-flex items-center h-10 px-5 rounded-lg text-sm font-medium text-zinc-200 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] transition-all duration-200">
                    Discover more
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
                Your movie companion
              </p>
              <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                <span className="text-white">Discover</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  movies & shows
                </span>
              </h1>
              <p className="mt-4 text-zinc-300 text-base sm:text-lg leading-relaxed max-w-md">
                Trending, top-rated, and upcoming — all in one place.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-6">
                <Link href="/search">
                  <button className="inline-flex items-center h-10 px-5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200">
                    Explore Movies
                  </button>
                </Link>
                <Link href="/tv">
                  <button className="inline-flex items-center h-10 px-5 rounded-lg text-sm font-medium text-zinc-200 bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.1] transition-all duration-200">
                    TV Shows
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
