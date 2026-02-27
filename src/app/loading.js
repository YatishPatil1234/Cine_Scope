import MovieCardSkeleton from "@/components/MovieCardSkeleton";

export default function Loading() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* HERO SKELETON */}
      <section className="relative min-h-[420px] sm:min-h-[520px] bg-slate-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="h-10 w-2/3 bg-slate-800 rounded mb-6" />
          <div className="h-4 w-1/2 bg-slate-800 rounded mb-3" />
          <div className="h-4 w-1/3 bg-slate-800 rounded mb-6" />
          <div className="h-10 w-40 bg-slate-800 rounded-lg" />
        </div>
      </section>

      {/* MOVIE SECTIONS */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-10 sm:py-16 space-y-14">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            {/* Section Title Skeleton */}
            <div className="h-6 w-40 bg-slate-800 rounded mb-6 animate-pulse" />

            {/* Movie Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
