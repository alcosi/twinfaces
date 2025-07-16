import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui";
import { Skeleton } from "@/shared/ui/skeleton";

export function CarouselSkeleton({ count = 1 }: { count?: number }) {
  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent>
        {Array.from({ length: count }).map((_, i) => (
          <CarouselItem key={i} className="pb-4">
            <Skeleton className="h-[480px] w-full rounded-lg" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export function ThumbnailsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-2 flex w-full items-center justify-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />

      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-20 rounded-md" />
      ))}

      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}
