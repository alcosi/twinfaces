import { type VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import React from "react";

import { cn } from "../libs";

const variants = cva("inline-block overflow-hidden", {
  variants: {
    variant: {
      default: "ring-primary",
      destructive: "ring-destructive",
      outline: "ring-input",
      secondary: "ring-secondary",
    },
    size: {
      default: "h-6 w-6 border",
      sm: "h-4 w-4 border",
      lg: "h-8 w-8 border-2",
      xlg: "h-16 w-16 border-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface Props extends VariantProps<typeof variants> {
  url: string;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<Props> = ({
  variant,
  size,
  url,
  alt = "Avatar",
  className,
}) => {
  return (
    <Image
      src={url}
      className={cn(variants({ variant, size }), className)}
      alt={alt}
      width={800}
      height={500}
    />
  );
};
