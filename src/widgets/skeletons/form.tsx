import { Skeleton } from "@/shared/ui";

export function FormSkeleton() {
  return (
    <div className="flex max-w-lg grow-1 flex-col space-y-6 p-6">
      {/* Form Title */}
      <Skeleton className="h-8 w-1/2 rounded-md" />

      {/* Form Description */}
      <Skeleton className="h-4 w-3/4 rounded-md" />

      {/* Form Fields */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Skeleton className="h-12 flex-1 rounded-md" />
        <Skeleton className="h-12 flex-1 rounded-md" />
      </div>

      {/* Footer */}
      <div className="flex justify-center">
        <Skeleton className="h-4 w-40 rounded-md" />
      </div>
    </div>
  );
}
