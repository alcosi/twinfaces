import { useTheme } from "next-themes";
import Image from "next/image";

import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui";

type ProductSliderProps = {
  images: {
    src: string;
    alt: string;
  }[];
};

export const ProductSlider = ({ images }: ProductSliderProps) => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  return (
    <Carousel className="w-full max-w-full overflow-hidden rounded-lg">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-0">
                <div className="relative w-full h-full">
                  <Image
                    fill
                    src={image.src}
                    alt={image.alt}
                    className="rounded-lg object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-4 mt-4 relative z-10">
        <CarouselPrevious className="static mt-2" />
        <CarouselNext className="static mt-2" />
      </div>
    </Carousel>
  );
};
