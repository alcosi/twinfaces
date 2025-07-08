import { VariantProps, cva } from "class-variance-authority";
import React from "react";

import { cn } from "@/shared/libs";

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      fieldSize: {
        default: "h-10",
        sm: "h-8",
      },
      invalid: {
        true: "border-destructive",
        false: "border-input",
      },
    },
    defaultVariants: {
      fieldSize: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fieldSize, invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ fieldSize, invalid, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
