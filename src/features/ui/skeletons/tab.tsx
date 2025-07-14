import { Skeleton } from "@/shared/ui";

export function TabSkeleton() {
  return (
    <section className="space-y-6 p-6">
      <div className="border-border flex gap-6 border-b pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* TODO: Remove this when we will be able to apply Suspence to each face-widget */}
      {/* Task: https://alcosi.atlassian.net/browse/TWINFACES-603 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
