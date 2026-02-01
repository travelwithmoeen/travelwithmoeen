import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DestinationCardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-2 border-[#f7e2aa] bg-[#f9f5e9] p-6">
      {/* Diagonal Ribbon Skeleton */}
      <div className="absolute -left-8 top-6 -rotate-45 px-10 py-1">
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Centered Image Skeleton */}
      <div className="mb-6 mt-8 flex justify-center">
        <div className="overflow-hidden rounded-xl border-4 border-card bg-card p-1 shadow-lg">
          <Skeleton className="h-40 w-40 rounded-lg sm:h-48 sm:w-48" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col items-center text-center">
        <Skeleton className="mb-1 h-4 w-24" />
        <Skeleton className="mb-3 h-7 w-36" />
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-4/5" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}
