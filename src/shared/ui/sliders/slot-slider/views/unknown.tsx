"use client";

import { cn } from "@/shared/libs";
import { Caption, FileQuestionIcon } from "@/shared/ui";

export function UnknownSlide({
  title = "Unsupported file",
}: {
  title?: string;
}) {
  return (
    <div className="relative flex h-full items-center justify-center rounded-lg bg-secondary text-primary">
      <FileQuestionIcon className="h-10 w-10" />
      <Caption text={title} />
    </div>
  );
}

export function UnknownThumbnail({
  title = "Unknown file type",
  isActive,
}: {
  title?: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-secondary px-2 text-xs text-primary",
        isActive && "border-brand-500"
      )}
    >
      <FileQuestionIcon className="h-6 w-6" />
      <span className="w-full truncate text-center">{title}</span>
    </div>
  );
}
