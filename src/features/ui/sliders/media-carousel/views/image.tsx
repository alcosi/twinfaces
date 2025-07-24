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
    <div className="bg-secondary relative flex aspect-square w-full rounded-lg">
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
    <div
      className={cn(
        "relative aspect-square h-full w-full rounded-lg border-2 border-transparent",
        isActive && "border-brand-500"
      )}
    >
      <Image
        fill
        src={src}
        alt={alt}
        className={cn("rounded-lg object-cover")}
      />
    </div>
  );
}
