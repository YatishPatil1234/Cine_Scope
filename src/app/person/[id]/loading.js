export default function Loading() {
  return (
    <main className="pb-24 overflow-x-hidden animate-pulse">
      {/* HERO SECTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-16">
          {/* Profile Image Skeleton */}
          <div className="w-full max-w-[280px]">
            <div className="aspect-[3/4] rounded-2xl bg-slate-800 border border-slate-800" />
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 space-y-8">
            {/* Name */}
            <div className="h-10 w-2/3 bg-slate-800 rounded-lg" />

            {/* Meta Pills */}
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-28 bg-slate-800 rounded-full" />
              ))}
            </div>

            {/* Bio Lines */}
            <div className="space-y-3 max-w-3xl">
              <div className="h-4 w-full bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-800 rounded" />
              <div className="h-4 w-5/6 bg-slate-800 rounded" />
              <div className="h-4 w-2/3 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px w-full bg-slate-800 opacity-40 mb-20" />

      {/* Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-6 w-40 bg-slate-800 rounded mb-8" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-slate-800" />
          ))}
        </div>
      </section>
    </main>
  );
}
