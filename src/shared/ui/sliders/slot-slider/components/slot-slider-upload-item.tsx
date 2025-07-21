import { UploadCloudIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { uploadTwinAttachment } from "../../../../../entities/twin/server";
import { ImageCropModal } from "../../../../../features/ui/image-cropper-modal";

type Props = {
  onUploadComplete?: (file: string) => void;
  twinId?: string;
};

export function SlotSliderUploadItem({ onUploadComplete, twinId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

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
      uploadTwinAttachment(twinId!, selected)
        .then(() => {
          onUploadComplete?.(selected.name);
          router.refresh();
        })
        .catch(console.error);
    }
  }

  function handleCropComplete(base64: string) {
    const blob = base64ToBlob(base64);
    const fileName = imageFile?.name;
    const fileType = imageFile?.type;

    const croppedFile = new File([blob], fileName!, {
      type: blob.type || fileType,
    });

    uploadTwinAttachment(twinId!, croppedFile)
      .then(() => {
        onUploadComplete?.(base64);
        router.refresh();
      })
      .catch(console.error);

    setModalOpen(false);
  }

  return (
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
      <div
        className="border-muted bg-muted/20 text-muted-foreground hover:bg-muted/40 flex h-full w-full cursor-pointer items-center justify-center border border-dashed"
        onClick={handleClick}
      >
        <UploadCloudIcon className="h-6 w-6" />
      </div>
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
