"use client";

import { useRouter } from "next/navigation";

import { uploadTwinAttachment } from "@/entities/twin/server";
import { SlotSliderWithUpload } from "@/features/ui/media-slider";
import { MediaItem } from "@/shared/ui/sliders/slot-slider/types";

type TW001ClientProps = {
  items: MediaItem[];
  twinId: string;
};

export function TW001Client({ items, twinId }: TW001ClientProps) {
  const router = useRouter();

  async function handleUploadFile(file: File) {
    await uploadTwinAttachment(twinId, file);
    router.refresh();
  }

  return <SlotSliderWithUpload items={items} onUploadFile={handleUploadFile} />;
}
