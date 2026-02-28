import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div className="space-y-0 overflow-hidden rounded-xl border border-slate-800 bg-card">
      <Skeleton
        className="w-full rounded-t-xl rounded-b-none"
        style={{ aspectRatio: "2/3" }}
      />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
