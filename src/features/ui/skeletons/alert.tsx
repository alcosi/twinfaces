import { Skeleton } from "@/shared/ui";

export function AlertSkeleton() {
  return (
    <div className="grid grid-cols-[1rem_1fr] grid-rows-2 gap-x-2.5 rounded-md border p-4">
      <Skeleton className="row-span-2 h-4 w-4 self-center" />
      <Skeleton className="col-start-2 h-4 w-32" />
      <Skeleton className="col-start-2 h-3 w-48" />
    </div>
  );
}
