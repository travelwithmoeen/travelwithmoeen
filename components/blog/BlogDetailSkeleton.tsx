import { Skeleton } from "@/components/ui/skeleton";

export function BlogDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-64 w-full md:h-96" />

      {/* Title Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
      </div>

      {/* Meta Info Skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-8">
        {/* Section 1 */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Image Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-64 w-full max-w-2xl rounded-lg" />
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Image Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-64 w-full max-w-2xl rounded-lg" />
        </div>
      </div>
    </div>
  );
}
