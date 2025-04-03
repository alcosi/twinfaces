"use client";

import Image from "next/image";

import { cn } from "@/shared/libs";
import { Caption } from "@/shared/ui";

export function ImageSlide({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <div className="relative flex aspect-square w-full rounded-lg bg-secondary">
      <Image
        fill
        src={src}
        alt={alt || "Image"}
        className="rounded-lg object-cover"
      />
      {caption && <Caption text={caption} />}
    </div>
  );
}

export function ImageThumbnail({
  src,
  alt = "Thumbnail",
  isActive,
}: {
  src: string;
  alt?: string;
  isActive?: boolean;
}) {
  return (
    <div className={`relative aspect-square rounded-lg bg-secondary`}>
      <Image
        fill
        src={src}
        alt={alt}
        className={cn(
          "rounded-lg object-cover",
          isActive && "ring-2 ring-brand"
        )}
      />
    </div>
  );
}
