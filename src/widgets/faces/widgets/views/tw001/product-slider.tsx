"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { TwinAttachments } from "@/entities/twin/server";
import { isTruthy } from "@/shared/libs";
import {
  Card,
  CardContent,
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

export const ProductSlider = ({ images }: { images: TwinAttachments[] }) => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [mainSlider, setMainSlider] = useState<CarouselApi | null>(null);
  const [thumbnailSlider, setThumbnailSlider] = useState<CarouselApi | null>(
    null
  );

  const handleActiveSlide = useCallback(
    (index: number) => {
      setActiveSlide(index);
      mainSlider?.scrollTo(index);
      thumbnailSlider?.scrollTo(index);
    },
    [mainSlider]
  );

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
            {isTruthy(images.length) ? (
              images.map((image) => (
                <CarouselItem key={image.id}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <div className="relative w-full h-full">
                        <Image
                          fill
                          src={image.storageLink!}
                          alt={image.title!}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="flex justify-center items-center h-full">
                <div className="text-center text-gray-500">
                  No images available
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-4 relative z-10"></div>
        </Carousel>
      </div>

      {isTruthy(images.length) ? (
        <Carousel
          setApi={setThumbnailSlider}
          className="w-full max-w-full relative"
        >
          {images.length > 4 ? (
            <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
          ) : (
            ""
          )}
          <CarouselContent className="-ml-1">
            {images.map((image, index) => (
              <CarouselItem
                key={image.id}
                className="p-2 md:basis-1/4 cursor-pointer"
                onClick={() => handleActiveSlide(index)}
              >
                <Card
                  className={`border ${
                    activeSlide === index
                      ? "ring-2 ring-sidebar-ring dark:ring-yellow-500"
                      : ""
                  }`}
                >
                  <CardContent className="flex aspect-square items-center justify-center p-1">
                    <div className="relative w-full h-full">
                      <Image
                        fill
                        src={image.storageLink!}
                        alt={image.title!}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 4 ? (
            <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10" />
          ) : (
            ""
          )}
        </Carousel>
      ) : (
        ""
      )}
    </>
  );
};
