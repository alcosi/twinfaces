"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/libs";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer border-input bg-background ring-offset-background focus-visible:ring-ring flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-link-enabled data-[state=checked]:bg-link-enabled data-[state=checked]:text-white",
      "data-[state=indeterminate]:border-slate-500 data-[state=indeterminate]:bg-slate-500 data-[state=indeterminate]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {props.checked === "indeterminate" && (
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      )}
      {props.checked === true && (
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
