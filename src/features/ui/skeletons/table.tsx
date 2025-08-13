import { Skeleton } from "@/shared/ui";

export function TableSkeleton({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  return (
    <section className="space-y-4">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      )}

      <div className="border-border w-full overflow-hidden rounded-lg border">
        <div className="bg-muted text-muted-foreground border-border grid grid-cols-[8rem_1fr_11rem_8rem_8rem] border-b px-4 py-2 text-sm font-medium">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>

        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="border-border grid grid-cols-[8rem_1fr_11rem_8rem_8rem] items-center gap-4 border-t px-4 py-3"
          >
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </section>
  );
}
