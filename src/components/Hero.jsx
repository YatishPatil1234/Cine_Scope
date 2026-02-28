import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const IMAGE_BASE = "https://image.tmdb.org/t/p";

export default function Hero({ featuredMovie = null }) {
  const hasBackdrop = featuredMovie?.backdrop_path;

  return (
    <section className="relative w-full min-h-[360px] sm:min-h-[480px] md:min-h-[520px] flex items-end overflow-hidden max-w-[100vw]">
      {/* Backdrop image or gradient */}
      {hasBackdrop ? (
        <>
          <Image
            src={`${IMAGE_BASE}/original${featuredMovie.backdrop_path}`}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-[var(--background)]/20"
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-[var(--background)]" aria-hidden />
      )}

      {/* Ambient orbs (when no backdrop or as extra layer) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16 md:pb-20 pt-20 sm:pt-24 w-full box-border">
        <div className="max-w-2xl min-w-0">
          {hasBackdrop && (
            <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-4">
              Trending now
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight break-words">
            {hasBackdrop ? (
              <span className="text-foreground">{featuredMovie.title}</span>
            ) : (
              <>
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Discover movies
                </span>
                <br />
                <span className="text-indigo-400">worth your time</span>
              </>
            )}
          </h1>

          <p className="mt-3 sm:mt-4 text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl leading-relaxed">
            {hasBackdrop
              ? "Explore trending, popular, and upcoming films. Save your favorites and build your watchlist."
              : "Explore trending, popular, and top-rated films. Save your favorites and build your watchlist."}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
            {hasBackdrop && (
              <Link
                href={`/movie/${featuredMovie.id}`}
                className="cursor-pointer"
              >
                <Button
                  size="lg"
                  className="cursor-pointer bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 h-11 px-5 text-sm font-medium rounded-lg"
                >
                  View movie
                </Button>
              </Link>
            )}
            <Link href="/search" className="cursor-pointer">
              <Button
                size="lg"
                variant={hasBackdrop ? "outline" : "default"}
                className="cursor-pointer h-11 px-5 text-sm font-medium rounded-lg"
              >
                Explore Movies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
