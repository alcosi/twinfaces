"use client";

import { useRouter } from "next/navigation";

import { uploadTwinAttachment } from "@/entities/twin/server";
import { SlotSlider } from "@/shared/ui";
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

  return <SlotSlider items={items} onUploadFile={handleUploadFile} />;
}
