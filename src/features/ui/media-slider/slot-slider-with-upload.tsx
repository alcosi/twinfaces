"use client";

import { useRef, useState } from "react";

import { SlotSlider } from "@/shared/ui";
import { SlotSliderItem } from "@/shared/ui/sliders/slot-slider/components/slot-slider-item";
import { SlotSliderUploadItem } from "@/shared/ui/sliders/slot-slider/components/slot-slider-upload-item";
import { MediaItem } from "@/shared/ui/sliders/slot-slider/types";

import { ImageCropModal } from "../image-cropper-modal";
import { SlotSliderPlaceholder } from "./slot-slider-placeholder";
import { SlotSliderThumbnail } from "./slot-slider-thumbnail";

type SlotSliderWithUploadProps<T> = {
  items: T[];
  onUploadFile: (file: File) => Promise<void>;
};

export function SlotSliderWithUpload<T extends MediaItem>({
  items,
  onUploadFile,
}: SlotSliderWithUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    const isGif = selected.name.toLowerCase().endsWith(".gif");
    const isImage = selected.type.startsWith("image/") && !isGif;

    if (isImage) {
      setImageFile(selected);
      setModalOpen(true);
    } else {
      onUploadFile(selected).catch(console.error);
    }
  }

  async function handleCropComplete(base64: string) {
    const blob = base64ToBlob(base64);
    const croppedFile = new File([blob], imageFile?.name || "cropped.png", {
      type: blob.type || imageFile?.type,
    });

    await onUploadFile(croppedFile);
    setModalOpen(false);
  }

  const uploadSlot = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <ImageCropModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        file={imageFile}
        onCropComplete={handleCropComplete}
      />
      <SlotSliderUploadItem onClick={handleClick} />
    </>
  );

  const sliderItems = [
    ...items.map((item) => ({
      kind: "media" as const,
      data: item,
      renderMain: <SlotSliderItem item={item} />,
      renderThumb: (isActive: boolean) => (
        <SlotSliderThumbnail item={item} isActive={isActive} />
      ),
    })),
    { kind: "custom" as const, node: uploadSlot },
    {
      kind: "placeholder" as const,
      node: <SlotSliderPlaceholder>{uploadSlot}</SlotSliderPlaceholder>,
    },
  ];

  return <SlotSlider items={sliderItems} />;
}

// === Utils ===
function base64ToBlob(base64: string | undefined): Blob {
  const parts = base64?.split(",");
  const mime = parts?.[0]?.match(/:(.*?);/)?.[1] || "";
  const binary = atob(parts?.[1]!);
  const len = binary.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    u8arr[i] = binary.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}
