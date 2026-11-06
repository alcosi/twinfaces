"use client";

import { FileIcon, UploadCloudIcon } from "lucide-react";

import { FileUploadButton } from "@/features/ui/file-upload-button";
import { Media } from "@/features/ui/sliders";

type TW001AttachmentListProps = {
  items: (Media & { type: string })[];
  onUploadFile: (file: File) => Promise<void>;
};

/**
 * Compact list display of twin attachments ("image_list" TW001 key):
 * a small 20x20 thumbnail (file icon for non-images) with file name
 * and extension, each row links to the stored file.
 */
export function TW001AttachmentList({
  items,
  onUploadFile,
}: TW001AttachmentListProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <ul className="flex flex-col">
        {items.map((item) => {
          const { name, ext } = splitFileName(item.url, item.title);
          return (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted flex items-center gap-2 rounded px-1 py-0.5"
              >
                <RowThumb item={item} />
                <span className="truncate text-sm">
                  {name}
                  {ext && <span className="text-muted-foreground">{ext}</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <FileUploadButton
        title="Upload File"
        variant="ghost"
        size="iconSm"
        className="self-start"
        onChange={onUploadFile}
      >
        <UploadCloudIcon />
      </FileUploadButton>
    </div>
  );
}

function RowThumb({ item }: { item: Media & { type: string } }) {
  if (item.type === "image") {
    return (
      <img
        src={item.url}
        alt={item.title}
        className="h-5 w-5 shrink-0 rounded object-cover"
      />
    );
  }
  return <FileIcon className="text-muted-foreground h-5 w-5 shrink-0" />;
}

function splitFileName(
  url: string,
  title?: string
): { name: string; ext: string } {
  const fallback = (() => {
    try {
      return decodeURIComponent(
        new URL(url, window.location.origin).pathname.split("/").pop() ?? ""
      );
    } catch {
      return "";
    }
  })();

  const fileName = title?.trim() || fallback;
  const dot = fileName.lastIndexOf(".");

  return dot > 0
    ? { name: fileName.slice(0, dot), ext: fileName.slice(dot) }
    : { name: fileName, ext: "" };
}
