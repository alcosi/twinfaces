"use client";

import { useCallback, useEffect, useState } from "react";

import { cn, isPopulatedArray } from "@/shared/libs";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  FileQuestionIcon,
  PdfIcon,
} from "@/shared/ui";

import { ImageSlide, ImageThumbnail } from "./views/image";

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
              <CarouselItem className="flex justify-center items-center h-full">
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
          className="w-full max-w-full flex items-center"
        >
          <CarouselPrevious className="static" />

          <CarouselContent className="">
            {typedItems.map((item, index) => (
              <CarouselItem
                key={index}
                className="p-2 md:basis-1/4 cursor-pointer"
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

// HELPERS

function SlotSliderItem({ item }: { item: MediaItem & { type: string } }) {
  switch (item.type) {
    case "image":
      return (
        <ImageSlide src={item.url} alt={item.title} caption={item.title} />
      );
    case "video":
      return (
        <video controls className="w-full rounded-lg aspect-square">
          <source src={item.url} type="video/mp4" />
        </video>
      );
    case "text":
      return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg aspect-square flex items-center justify-center text-center">
          <p>{item.content ?? item.title ?? "No text"}</p>
        </div>
      );
    case "pdf":
      return (
        <iframe
          src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(item.url)}`}
          title={item.title ?? "PDF"}
          className="w-full h-full rounded-lg aspect-square border"
        />
      );
    default:
      return (
        <div className="aspect-square flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
          Unsupported file
        </div>
      );
  }
}

function SlotSliderThumbnail({
  item,
  isActive,
}: {
  item: MediaItem & { type: string };
  isActive?: boolean;
}) {
  if (item.type === "image") {
    return (
      <ImageThumbnail src={item.url} alt={item.title} isActive={isActive} />
    );
  }
  if (item.type === "pdf") {
    return (
      <div
        className={`relative w-full aspect-square border flex-column content-center justify-items-center text-xs text-gray-500 bg-white dark:bg-gray-900 ${
          isActive ? "ring-2 ring-sidebar-ring dark:ring-yellow-500" : ""
        }`}
      >
        <PdfIcon className="w-6 h-6" />
        {item.title}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "text-xs text-gray-400 flex items-center justify-center h-full",
        isActive && "ring-2 ring-sidebar-ring dark:ring-yellow-500"
      )}
    >
      <FileQuestionIcon className="w-6 h-6" />
      {item.type}
    </div>
  );
}

function inferTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("text/")) return "text";
  return "unknown";
}

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
