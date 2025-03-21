import { Skeleton } from "@/shared/ui";

export function LoadingScreen() {
  return (
    <div className="grid grid-cols-[0.7fr_1fr_1fr] grid-rows-[2.5rem_24rem_2rem] gap-4 my-4">
      <Skeleton className="rounded-lg" />
      <Skeleton className="col-start-3 rounded-lg" />

      <Skeleton className="col-span-3 rounded-lg" />

      <Skeleton className="col-start-3 rounded-lg" />
    </div>
  );
}
