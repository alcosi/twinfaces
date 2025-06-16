import { Skeleton } from "@/shared/ui";

export function TableSkeleton({ withHeader = true }: { withHeader?: boolean }) {
  const gridRows = withHeader
    ? "grid-rows-[2.5rem_24rem_2rem]"
    : "grid-rows-[24rem_2rem]";

  return (
    <div
      className={`my-4 grid grid-cols-[1.75fr_0.5fr_0.75fr] ${gridRows} gap-4`}
    >
      {withHeader && (
        <>
          <Skeleton className="h-7 w-36 self-center rounded-md" />
          <div className="col-start-3 inline-flex justify-end gap-4">
            <Skeleton className="w-14 rounded-md" />
            <Skeleton className="w-14 rounded-md" />
            <Skeleton className="w-14 rounded-md" />
            <Skeleton className="w-px rounded-md" />
            <Skeleton className="w-14 rounded-md" />
          </div>
        </>
      )}

      <div className="col-span-3 grid grid-cols-[0.75fr_1fr_1fr_1fr_1fr] grid-rows-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2">
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
        <Skeleton className="rounded-md" />
      </div>

      <div className="col-span-2 col-start-2 inline-flex justify-end space-x-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
