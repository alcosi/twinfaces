"use client";

import { cn } from "@/shared/libs";
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
      className={cn(
        "bg-secondary text-primary flex h-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-transparent px-2 text-xs",
        isActive && "border-brand-500"
      )}
    >
      <PdfIcon className="h-6 w-6" />
      <span className="w-full truncate text-center">{title}</span>
    </div>
  );
}
