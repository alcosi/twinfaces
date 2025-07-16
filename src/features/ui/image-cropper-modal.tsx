"use client";

import { useEffect, useRef, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";

import { ImageCropper, ImageCropperHandle } from "./image-cropper";

export function ImageCropModal({
  open,
  onOpenChange,
  onCropComplete,
  file,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCropComplete?: (croppedImage: string) => void;
  file?: File | null;
}) {
  const [image, setImage] = useState<string | null>(null);
  const cropperRef = useRef<ImageCropperHandle>(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  }, [file]);

  function handleSave() {
    const cropped = cropperRef.current?.getCroppedImage();
    if (cropped || image) {
      onCropComplete?.(cropped || image!);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100%] max-w-xl sm:max-h-[90%]">
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
        </DialogHeader>

        <div className="mx-auto my-6 max-w-md">
          <ImageCropper ref={cropperRef} image={image} />
        </div>

        {image && (
          <DialogFooter className="bg-background rounded-b-md p-6 sm:justify-end">
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
