"use client";

import { PdfIcon } from "@/shared/ui/icons";

export function PdfSlide({
  url,
  title = "PDF",
}: {
  url: string;
  title?: string;
}) {
  return (
    <iframe
      src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`}
      title={title}
      className="aspect-square h-full w-full rounded-lg border"
    />
  );
}

export function PdfThumbnail({
  title = "PDF File",
  isActive,
}: {
  title?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-2 rounded-lg bg-secondary px-2 text-xs text-primary ${
        isActive && "ring-brand-500 ring-2"
      }`}
    >
      <PdfIcon className="h-6 w-6" />
      <span className="w-full truncate text-center">{title}</span>
    </div>
  );
}
