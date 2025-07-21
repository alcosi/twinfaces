"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isEmptyArray,
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

import { SlotSliderItem } from "./components/slot-slider-item";
import { SlotSliderPlaceholder } from "./components/slot-slider-placeholder";
import { SlotSliderThumbnail } from "./components/slot-slider-thumbnail";
import { SlotSliderUploadItem } from "./components/slot-slider-upload-item";
import { MediaItem } from "./types";

type SlotSliderProps<T> = {
  items: T[];
  twinId?: string;
};

export function SlotSlider<T extends MediaItem>({
  items,
  twinId,
}: SlotSliderProps<T>) {
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

  if (isEmptyArray(items)) {
    return <SlotSliderPlaceholder twinId={twinId ?? ""} />;
  }

  return (
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
              className="h-20 min-w-24 basis-1/4 cursor-pointer items-stretch"
              onClick={() => handleThumbClick(index)}
            >
              <SlotSliderThumbnail item={item} isActive={current === index} />
            </CarouselItem>
          ))}

          <CarouselItem
            key="add-button"
            className="h-20 min-w-24 basis-1/4 cursor-pointer items-center justify-center"
          >
            <SlotSliderUploadItem twinId={twinId} />
          </CarouselItem>
        </CarouselContent>
        <CarouselNext className="static shrink translate-y-0" />
      </Carousel>
    </>
  );
}
