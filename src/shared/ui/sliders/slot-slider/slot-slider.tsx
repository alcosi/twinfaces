"use client";

import { useCallback, useEffect, useState } from "react";

import { isEmptyArray, isFalsy, useKeyboardNavigation } from "@/shared/libs";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

type SliderItem<T> =
  | {
      kind: "media";
      data: T;
      renderMain: React.ReactNode;
      renderThumb: (isActive: boolean) => React.ReactNode;
    }
  | { kind: "custom"; node: React.ReactNode }
  | { kind: "placeholder"; node: React.ReactNode };

type SlotSliderProps<T> = {
  items: SliderItem<T>[];
};

export function SlotSlider<T>({ items }: SlotSliderProps<T>) {
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

  const mediaItems = items.filter((item) => item.kind === "media");
  const placeholderItem = items.find((item) => item.kind === "placeholder");

  if (isEmptyArray(mediaItems) && placeholderItem) {
    return <>{placeholderItem.node}</>;
  }

  return (
    <>
      <Carousel setApi={setMainSlider} className="mb-2">
        <CarouselContent>
          {mediaItems.map((item, index) => (
            <CarouselItem key={`main-${index}`}>{item.renderMain}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        setApi={setThumbSlider}
        className="static flex h-20 w-full max-w-full items-center justify-between gap-2"
      >
        <CarouselPrevious className="static shrink translate-y-0" />
        <CarouselContent className="h-full w-full gap-1">
          {items.map((item, index) => {
            if (item.kind === "media") {
              return (
                <CarouselItem
                  key={`thumb-${index}`}
                  className="h-20 min-w-24 basis-1/4 cursor-pointer items-stretch"
                  onClick={() => handleThumbClick(index)}
                >
                  {item.renderThumb(current === index)}
                </CarouselItem>
              );
            }

            if (item.kind === "custom") {
              return (
                <CarouselItem
                  key={`custom-${index}`}
                  className="flex h-20 min-w-24 basis-1/4 items-center justify-center"
                >
                  {item.node}
                </CarouselItem>
              );
            }

            return null;
          })}
        </CarouselContent>
        <CarouselNext className="static shrink translate-y-0" />
      </Carousel>
    </>
  );
}
