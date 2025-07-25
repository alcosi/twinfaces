"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";

import { CircleIcon, RectangleIcon, Toggle } from "@/shared/ui";

export type ImageCropperHandle = {
  getCroppedImage: () => string | undefined;
};

export const ImageCropper = forwardRef<
  ImageCropperHandle,
  { image: string | null }
>(({ image }, ref) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [cropperShape, setCropperShape] = useState<"circle" | "rectangle">(
    "circle"
  );

  useImperativeHandle(ref, () => ({
    getCroppedImage: () => {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return;

      const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!canvas) return;
      return cropperShape === "circle"
        ? getRoundedCanvas(canvas).toDataURL()
        : canvas.toDataURL();
    },
  }));

  return (
    image && (
      <div className="relative flex items-center justify-center gap-4">
        <Cropper
          ref={cropperRef}
          src={image}
          aspectRatio={1}
          viewMode={1}
          guides={false}
          background={false}
          autoCropArea={1}
          dragMode="move"
          highlight={false}
          center
          cropBoxResizable
          cropBoxMovable
          className={cropperShape === "circle" ? "circle-cropper" : ""}
          style={{ height: "100%", width: "100%" }}
        />

        <div className="absolute right-2 bottom-2 z-20">
          <Toggle
            aria-label="Toggle shape"
            pressed={cropperShape === "circle"}
            variant="ghost"
            onPressedChange={(pressed) =>
              setCropperShape(pressed ? "circle" : "rectangle")
            }
            className="bg-primary data-[state=on]:bg-primary hover:bg-primary/50 hover:data-[state=on]:bg-primary/50 rounded-full"
          >
            <div className="rounded-full">
              {cropperShape === "circle" ? (
                <CircleIcon
                  width={24}
                  height={24}
                  strokeDasharray="4 4"
                  className="stroke-accent"
                />
              ) : (
                <RectangleIcon
                  width={24}
                  height={24}
                  className="stroke-accent"
                />
              )}
            </div>
          </Toggle>
        </div>
      </div>
    )
  );
});

function getRoundedCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  canvas.width = width;
  canvas.height = height;

  if (context) {
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      Math.PI * 2,
      true
    );
    context.fill();
  }

  return canvas;
}
