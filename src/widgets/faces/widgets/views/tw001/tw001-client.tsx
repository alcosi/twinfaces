"use client";

import { useRouter } from "next/navigation";

import { uploadTwinAttachment } from "@/entities/twin/server";
import { Media, MediaCarousel } from "@/features/ui/sliders";

import { TW001AttachmentList } from "./tw001-attachment-list";

type TW001ClientProps = {
  items: Media[];
  twinId: string;
  options: {
    imagesTwinClassFieldId?: string;
    /** face_tw001.key drives the display type: "image_list" -> compact list, otherwise carousel */
    displayType?: "carousel" | "list";
  };
};

export function TW001Client({ items, twinId, options }: TW001ClientProps) {
  const router = useRouter();

  async function handleUploadFile(file: File) {
    await uploadTwinAttachment(twinId, file, options);
    router.refresh();
  }

  if (options.displayType === "list") {
    return (
      <TW001AttachmentList items={items} onUploadFile={handleUploadFile} />
    );
  }

  return <MediaCarousel items={items} onUploadFile={handleUploadFile} />;
}
