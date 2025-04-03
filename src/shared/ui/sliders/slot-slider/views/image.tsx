"use client";

import Image from "next/image";

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
    <div className="relative w-full aspect-square">
      <Image
        fill
        src={src}
        alt={alt || "Image"}
        className="rounded-lg object-cover"
      />
      {caption && (
        <div className="absolute bottom-0 left-0 m-1 p-1 rounded-md bg-black/60 text-white text-xs text-center">
          {caption}
        </div>
      )}
    </div>
  );
}

export function ImageThumbnail({
  src,
  alt,
  isActive,
}: {
  src: string;
  alt?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={`relative w-full aspect-square border ${
        isActive ? "ring-2 ring-sidebar-ring dark:ring-yellow-500" : ""
      }`}
    >
      <Image
        fill
        src={src}
        alt={alt || "Thumbnail"}
        className="rounded-lg object-cover"
      />
    </div>
  );
}
