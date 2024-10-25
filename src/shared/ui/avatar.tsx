import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const variants = cva("inline-block rounded-full", {
  variants: {
    variant: {
      default: "ring-primary",
      destructive: "ring-destructive",
      outline: "ring-input",
      secondary: "ring-secondary",
    },
    size: {
      default: "h-6 w-6 ring-1",
      sm: "h-4 w-4 ring-0.5",
      lg: "h-8 w-8 ring-2",
      xlg: "h-24 w-24 ring-2",
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
}

export const Avatar: React.FC<Props> = ({
  variant,
  size,
  url,
  alt = "Avatar",
}) => {
  return <img className={variants({ variant, size })} src={url} alt={alt} />;
};
