"use client";

import { useRouter } from "next/navigation";

import { uploadTwinAttachment } from "@/entities/twin/server";
import { Media, MediaCarousel } from "@/features/ui/sliders";

type TW001ClientProps = {
  items: Media[];
  twinId: string;
  options: {
    imagesTwinClassFieldId?: string;
  };
};

export function TW001Client({ items, twinId, options }: TW001ClientProps) {
  const router = useRouter();

  async function handleUploadFile(file: File) {
    await uploadTwinAttachment(twinId, file, options);
    router.refresh();
  }

  return <MediaCarousel items={items} onUploadFile={handleUploadFile} />;
}
