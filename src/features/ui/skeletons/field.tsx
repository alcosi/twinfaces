import { Skeleton } from "@/shared/ui";

export function FormFieldSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
