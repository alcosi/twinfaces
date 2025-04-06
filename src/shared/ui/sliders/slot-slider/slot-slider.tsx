"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isFalsy,
  isPopulatedArray,
  useKeyboardNavigation,
} from "@/shared/libs";
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

export type MediaType = "image" | "video" | "text" | "pdf" | "unknown";

type MediaItem = {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  content?: string;
};

type SlotSliderProps<T> = {
  items: T[];
};

export function SlotSlider<T extends MediaItem>({ items }: SlotSliderProps<T>) {
  const [current, setCurrent] = useState<number>(0);
  const [mainSlider, setMainSlider] = useState<CarouselApi | null>(null);
  const [thumbSlider, setThumbSlider] = useState<CarouselApi | null>(null);

  useKeyboardNavigation({
    onLeft: () => mainSlider?.scrollPrev(),
    onRight: () => mainSlider?.scrollNext(),
  });

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

  return isPopulatedArray(items) ? (
    <>
      <Carousel setApi={setMainSlider} className="mb-2">
        <CarouselContent>
          {isPopulatedArray(items) &&
            items.map((item, index) => (
              <CarouselItem key={index}>
                <SlotSliderItem item={item} />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        setApi={setThumbSlider}
        className="static flex h-20 w-full max-w-full items-center justify-between gap-2"
      >
        <CarouselPrevious className="static shrink translate-y-0" />
        <CarouselContent className="h-full w-full gap-1">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="w-20 basis-1/4 h-full min-w-24 cursor-pointer items-stretch"
              onClick={() => handleThumbClick(index)}
            >
              <SlotSliderThumbnail item={item} isActive={current === index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="static shrink translate-y-0" />
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
