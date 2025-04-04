"use client";

import { useCallback, useEffect, useState } from "react";

import { isFalsy, isPopulatedArray } from "@/shared/libs";
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

// TODO: Support loading state for this component
export function SlotSlider<T extends MediaItem>({ items }: SlotSliderProps<T>) {
  const [current, setCurrent] = useState<number>(0);
  const [mainSlider, setMainSlider] = useState<CarouselApi | null>(null);
  const [thumbSlider, setThumbSlider] = useState<CarouselApi | null>(null);
  const [typedItems, setTypedItems] = useState<(T & { type: string })[]>([]);

  useEffect(() => {
    Promise.all(
      items.map(async (item) => ({
        ...item,
        type: await detectFileType(item.url),
      }))
    ).then(setTypedItems);
  }, [items]);

  const handleThumbClick = useCallback(
    (index: number) => {
      setCurrent(index);
      mainSlider?.scrollTo(index);
      thumbSlider?.scrollTo(index);
    },
    [mainSlider]
  );

  useEffect(() => {
    if (isFalsy(mainSlider)) return;

    mainSlider.on("select", () => {
      const index = mainSlider.selectedScrollSnap();
      setCurrent(index);
      thumbSlider?.scrollTo(index);
    });
  }, [mainSlider]);

  // TODO: Add keyboard / swipe navigation,
  // useEffect(() => {
  //   const handleKeyboardDown = (e: KeyboardEvent) => {
  //     if (e.key === "ArrowLeft") {
  //       handleActiveSlide(Math.max(activeSlide - 1, 0));
  //     } else if (e.key === "ArrowRight") {
  //       handleActiveSlide(Math.min(activeSlide + 1, typedItems.length - 1));
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyboardDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyboardDown);
  //   };
  // }, [activeSlide, handleActiveSlide, typedItems.length]);

  return isPopulatedArray(typedItems) ? (
    <>
      <Carousel setApi={setMainSlider} className="mb-2">
        <CarouselContent>
          {isPopulatedArray(typedItems) &&
            typedItems.map((item, index) => (
              <CarouselItem key={index}>
                <SlotSliderItem item={item} />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        setApi={setThumbSlider}
        className="flex w-full max-w-full items-center"
      >
        <CarouselPrevious className="static" />
        <CarouselContent>
          {typedItems.map((item, index) => (
            <CarouselItem
              key={index}
              className="h-full min-w-24 cursor-pointer py-0.5 md:basis-1/4"
              onClick={() => handleThumbClick(index)}
            >
              <SlotSliderThumbnail item={item} isActive={current === index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="static" />
      </Carousel>
    </>
  ) : null;
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
