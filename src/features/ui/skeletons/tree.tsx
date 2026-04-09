import { Skeleton } from "@/shared/ui";

type TreeSkeletonProps = {
  level: number;
  rows?: number;
  withLoadMore?: boolean;
  mode?: "default" | "card";
};

export function TreeSkeleton({
  level,
  rows = 10,
  withLoadMore = true,
  mode = "default",
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

          {mode === "card" ? (
            <div className="flex min-w-0 items-start gap-2 px-1.5 py-1">
              <div className="flex h-4 w-4 items-center justify-center">
                <Skeleton className="bg-muted/70 h-3 w-3 animate-[pulse_2.5s_ease-in-out_infinite] rounded-sm" />
              </div>

              <div className="bg-background/80 relative w-full max-w-[280px] min-w-0 rounded-2xl border px-3.5 py-3">
                <Skeleton className="bg-muted/70 absolute inset-x-4 top-0 h-1 animate-[pulse_2.5s_ease-in-out_infinite] rounded-b-full" />

                <div className="mb-2 flex items-center gap-2 pt-1">
                  <Skeleton className="bg-muted/70 h-3 w-12 animate-[pulse_2.5s_ease-in-out_infinite] rounded-sm" />
                  <Skeleton
                    className={[
                      "bg-muted/70 h-5 animate-[pulse_2.5s_ease-in-out_infinite] rounded-full",
                      rowIndex % 2 === 0 ? "w-48" : "w-36",
                    ].join(" ")}
                  />
                </div>

                <div className="mb-2 space-y-1.5">
                  <Skeleton className="bg-muted/70 h-3 w-16 animate-[pulse_2.5s_ease-in-out_infinite] rounded-sm" />
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 4 }).map((_, chipIndex) => (
                      <Skeleton
                        key={chipIndex}
                        className={[
                          "bg-muted/65 h-5 animate-[pulse_2.5s_ease-in-out_infinite] rounded-full",
                          chipIndex % 2 === 0 ? "w-24" : "w-16",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Skeleton className="bg-muted/70 h-3 w-20 animate-[pulse_2.5s_ease-in-out_infinite] rounded-sm" />
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 3 }).map((_, chipIndex) => (
                      <Skeleton
                        key={chipIndex}
                        className={[
                          "bg-muted/65 h-5 animate-[pulse_2.5s_ease-in-out_infinite] rounded-full",
                          chipIndex % 2 === 0 ? "w-28" : "w-20",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
          )}
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
