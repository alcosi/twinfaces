import { useRef, useState } from "react";

import { Redefine } from "@/shared/libs";
import { Button, ButtonProps, Input } from "@/shared/ui";

import { ImageCropModal } from "./image-cropper-modal";

type Props = Redefine<
  ButtonProps,
  {
    onChange: (file: File) => void;
  }
>;

export function FileUploadButton({ onChange, children, ...props }: Props) {
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
      onChange(selected);
    }
  }

  async function handleCropComplete(base64: string) {
    const blob = base64ToBlob(base64);
    const croppedFile = new File([blob], imageFile?.name || "cropped.png", {
      type: blob.type || imageFile?.type,
    });

    onChange(croppedFile);
    setModalOpen(false);
  }

  return (
    <>
      <Button {...props} onClick={handleClick}>
        {children}
      </Button>

      <Input
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
    </>
  );
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
