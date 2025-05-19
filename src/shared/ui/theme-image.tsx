"use client";

import Image, { ImageProps } from "next/image";

import { cn } from "../libs";

type Props = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
} & Partial<ImageProps>;

export function ThemeImage({
  lightSrc,
  darkSrc,
  alt,
  width,
  height,
  className,
  ...props
}: Props) {
  return (
    <>
      <Image
        src={lightSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn("block dark:hidden", className)}
        {...props}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn("hidden dark:block", className)}
        {...props}
      />
    </>
  );
}
