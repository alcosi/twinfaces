import { Skeleton } from "@/shared/ui";

export function WidgetItemSkeleton() {
  return (
    <section className="flex flex-col space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </section>
  );
}
