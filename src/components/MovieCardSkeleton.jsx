export default function MovieCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div
        className="w-full rounded-xl bg-white/[0.05]"
        style={{ aspectRatio: "2/3" }}
      />
      <div className="mt-2 space-y-1.5 px-0.5">
        <div className="h-3 w-4/5 rounded bg-white/[0.06]" />
        <div className="h-2.5 w-1/3 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}
