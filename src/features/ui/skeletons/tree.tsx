import { Skeleton } from "@/shared/ui";

type TreeSkeletonProps = {
  level: number;
  rows?: number;
  withLoadMore?: boolean;
};

export function TreeSkeleton({
  level,
  rows = 10,
  withLoadMore = true,
}: TreeSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-1 py-1 text-sm">
          {Array.from({ length: level }).map((_, i) => (
            <div key={i} className="relative w-5 self-stretch">
              <div className="bg-border/40 absolute top-0 bottom-0 left-2 w-px" />
            </div>
          ))}

          <div className="flex items-center gap-2 rounded-md px-1.5 py-1">
            <div className="flex h-4 w-4 items-center justify-center">
              <Skeleton className="bg-muted/70 h-3 w-3 animate-[pulse_2.5s_ease-in-out_infinite] rounded-sm" />
            </div>

            <Skeleton
              className={[
                "bg-muted/70 h-4 rounded-md",
                "animate-[pulse_2.5s_ease-in-out_infinite]",
                rowIndex % 2 === 0 ? "w-44" : "w-32",
              ].join(" ")}
            />
          </div>
        </div>
      ))}

      {withLoadMore && (
        <div className="flex items-center gap-1 py-1 text-sm">
          {Array.from({ length: level }).map((_, i) => (
            <div key={i} className="relative w-5 self-stretch">
              <div className="bg-border/40 absolute top-0 bottom-0 left-2 w-px" />
            </div>
          ))}

          <div className="flex items-center gap-2 rounded-md px-1.5 py-1">
            <Skeleton className="bg-muted/60 h-3 w-3 animate-[pulse_2.5s_ease-in-out_infinite] rounded-sm" />
            <Skeleton className="bg-muted/60 h-3 w-20 animate-[pulse_2.5s_ease-in-out_infinite] rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
}
