"use client";

import { UploadCloudIcon } from "lucide-react";
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

import { FileUploadButton } from "../../file-upload-button";
import { MediaCarouselPlaceholder } from "./media-carousel-placeholder";
import { MediaItem } from "./media-item";
import { MediaItemThumbnail } from "./media-item-thumbnail";
import { Media } from "./types";

type Props<T> = {
  items: T[];
  onUploadFile: (file: File) => Promise<void>;
};

export function MediaCarousel<T extends Media>({
  items,
  onUploadFile,
}: Props<T>) {
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
    return <MediaCarouselPlaceholder />;
  }

  return (
    <>
      <Carousel setApi={setMainSlider} className="mb-2">
        <CarouselContent>
          {isPopulatedArray(items) &&
            items.map((item, index) => (
              <CarouselItem key={index}>
                <MediaItem item={item} />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>

      <Carousel setApi={setThumbSlider} className="flex w-full flex-col gap-2">
        <CarouselContent className="gap-1">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="h-20 min-w-24 basis-1/4 cursor-pointer items-stretch"
              onClick={() => handleThumbClick(index)}
            >
              <MediaItemThumbnail item={item} isActive={current === index} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-around">
          <CarouselPrevious
            title="Prev"
            className="static shrink translate-y-0"
          />

          <FileUploadButton
            title="Upload File"
            variant="ghost"
            size="iconSm"
            onChange={onUploadFile}
          >
            <UploadCloudIcon />
          </FileUploadButton>

          <CarouselNext title="Next" className="static shrink translate-y-0" />
        </div>
      </Carousel>
    </>
  );
}
