export default function Loading() {
  return (
    <main className="pb-24 overflow-x-hidden animate-pulse">
      {/* HERO */}
      <section className="py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="h-12 w-1/2 mx-auto bg-slate-800 rounded-lg" />
          <div className="h-4 w-1/3 mx-auto bg-slate-800 rounded" />
        </div>
      </section>

      {/* Divider */}
      <div className="h-px w-full bg-slate-800 opacity-40 mb-16" />

      {/* Control Bar Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <div className="h-16 bg-slate-800 rounded-xl" />
      </section>

      {/* Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-slate-800" />
          ))}
        </div>
      </section>
    </main>
  );
}
