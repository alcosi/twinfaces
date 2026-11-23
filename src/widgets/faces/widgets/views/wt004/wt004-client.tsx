"use client";

import { useRouter } from "next/navigation";

import { uploadTwinAttachment } from "@/entities/twin/server";
import { Media, MediaCarousel } from "@/features/ui/sliders";

import { WT004AttachmentList } from "./wt004-attachment-list";

type WT004ClientProps = {
  items: Media[];
  twinId: string;
  options: {
    imagesTwinClassFieldId?: string;
    /** Widget key "image_list" -> compact list, otherwise carousel. */
    displayType?: "carousel" | "list";
  };
};

export function WT004Client({ items, twinId, options }: WT004ClientProps) {
  const router = useRouter();

  async function handleUploadFile(file: File) {
    await uploadTwinAttachment(twinId, file, options);
    router.refresh();
  }

  if (options.displayType === "list") {
    return (
      <WT004AttachmentList items={items} onUploadFile={handleUploadFile} />
    );
  }

  return <MediaCarousel items={items} onUploadFile={handleUploadFile} />;
}
