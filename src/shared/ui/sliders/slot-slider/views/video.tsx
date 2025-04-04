"use client";

import { cn } from "@/shared/libs";
import { Caption } from "@/shared/ui";

export function VideoSlide({ src, title }: { src: string; title?: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
      <video
        controls
        className="h-full w-full rounded-lg object-cover"
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {title && <Caption text={title} position="top-left" />}
    </div>
  );
}

export function VideoThumbnail({
  src,
  isActive,
}: {
  src: string;
  isActive?: boolean;
}) {
  return (
    <video
      src={src}
      muted
      className={cn(
        "h-full w-full rounded-lg object-cover",
        isActive && "ring-brand-500 ring-2"
      )}
      title="Video thumbnail"
    />
  );
}
