import { FormSkeleton } from "@/features/ui/skeletons";

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <FormSkeleton />
    </div>
  );
}
