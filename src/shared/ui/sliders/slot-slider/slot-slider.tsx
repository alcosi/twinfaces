"use client";

import { useCallback, useEffect, useState } from "react";

import { isPopulatedArray } from "@/shared/libs";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

import { ImageSlide, ImageThumbnail } from "./views/image";
import { PdfSlide, PdfThumbnail } from "./views/pdf";
import { UnknownSlide, UnknownThumbnail } from "./views/unknown";
import { VideoSlide, VideoThumbnail } from "./views/video";

type MediaType = "image" | "video" | "text" | "pdf" | "unknown";

type MediaItem = {
  id: string;
  url: string;
  title?: string;
  content?: string;
};

type SlotSliderProps<T> = {
  items: T[];
};

export function SlotSlider<T extends MediaItem>({ items }: SlotSliderProps<T>) {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [mainSlider, setMainSlider] = useState<CarouselApi | null>(null);
  const [thumbnailSlider, setThumbnailSlider] = useState<CarouselApi | null>(
    null
  );
  const [typedItems, setTypedItems] = useState<(T & { type: string })[]>([]);

  useEffect(() => {
    Promise.all(
      items.map(async (item) => ({
        ...item,
        type: await detectFileType(item.url),
      }))
    ).then(setTypedItems);
  }, [items]);

  const handleActiveSlide = useCallback(
    (index: number) => {
      setActiveSlide(index);
      mainSlider?.scrollTo(index);
      thumbnailSlider?.scrollTo(index);
    },
    [mainSlider]
  );

  useEffect(() => {
    const handleKeyboardDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleActiveSlide(Math.max(activeSlide - 1, 0));
      } else if (e.key === "ArrowRight") {
        handleActiveSlide(Math.min(activeSlide + 1, typedItems.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyboardDown);
    return () => {
      window.removeEventListener("keydown", handleKeyboardDown);
    };
  }, [activeSlide, handleActiveSlide, typedItems.length]);

  mainSlider?.on("select", () => {
    const selectedIndex = mainSlider.selectedScrollSnap();
    setActiveSlide(selectedIndex);
    thumbnailSlider?.scrollTo(selectedIndex);
  });

  return (
    <>
      <div>
        <Carousel setApi={setMainSlider} className="w-full max-w-full">
          <CarouselContent>
            {isPopulatedArray(typedItems) ? (
              typedItems.map((item, index) => (
                <CarouselItem key={index} className="pb-4">
                  <SlotSliderItem item={item} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="flex h-full items-center justify-center">
                <div className="text-center text-gray-500">
                  No items available
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>

      {isPopulatedArray(typedItems) && (
        // TODO: update styling in this block
        <Carousel
          setApi={setThumbnailSlider}
          className="flex w-full max-w-full items-center"
        >
          <CarouselPrevious className="static" />

          <CarouselContent className="">
            {typedItems.map((item, index) => (
              <CarouselItem
                key={index}
                className="cursor-pointer p-2 md:basis-1/4"
                onClick={() => handleActiveSlide(index)}
              >
                <SlotSliderThumbnail
                  item={item}
                  isActive={activeSlide === index}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext className="static" />
        </Carousel>
      )}
    </>
  );
}

// === SlotSlider Views ===

function SlotSliderItem({ item }: { item: MediaItem & { type: string } }) {
  switch (item.type) {
    case "image":
      return (
        <ImageSlide src={item.url} alt={item.title} caption={item.title} />
      );
    case "text":
      return <span>TODO</span>;
    case "video":
      return <VideoSlide src={item.url} title={item.title} />;
    case "pdf":
      return <PdfSlide url={item.url} title={item.title} />;
    default:
      return <UnknownSlide title={item.title} />;
  }
}

function SlotSliderThumbnail({
  item,
  isActive,
}: {
  item: MediaItem & { type: string };
  isActive?: boolean;
}) {
  switch (item.type) {
    case "image":
      return (
        <ImageThumbnail src={item.url} alt={item.title} isActive={isActive} />
      );
    case "text":
      return <span>TODO</span>;
    case "video":
      return <VideoThumbnail src={item.url} isActive={isActive} />;
    case "pdf":
      return <PdfThumbnail title={item.title} isActive={isActive} />;
    default:
      return <UnknownThumbnail title={item.title} isActive={isActive} />;
  }
}

// === Utils ===

function inferTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("text/")) return "text";
  return "unknown";
}

// TODO: this function can't be located in `@/shared` due to `/api/mime-type?url=`
async function detectFileType(url: string): Promise<MediaType> {
  try {
    const res = await fetch(`/api/mime-type?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return inferTypeFromMime(data.mime || "");
  } catch (e) {
    console.error("Failed to detect file type:", e);
    return "unknown";
  }
}
