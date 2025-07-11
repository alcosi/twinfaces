import { Skeleton } from "@/shared/ui";

export function PG002Skeleton() {
  return (
    <section className="space-y-6 p-6">
      <div className="border-border flex gap-6 border-b pb-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-start space-y-4">
          <Skeleton className="h-[480px] w-[480px] rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="h-[77px] w-[82px] rounded-md" />
            <Skeleton className="h-[77px] w-[82px] rounded-md" />
            <Skeleton className="h-[77px] w-[82px] rounded-md" />
            <Skeleton className="h-[77px] w-[82px] rounded-md" />
            <Skeleton className="h-[77px] w-[82px] rounded-md" />
          </div>

          <div className="w-full space-y-2 pt-4">
            <div>
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div>
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[90%]" />
            <Skeleton className="h-5 w-[85%]" />
          </div>

          <div className="border-border bg-muted space-y-2 rounded-md border p-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
          </div>
        </div>
      </div> */}
    </section>
  );
}
