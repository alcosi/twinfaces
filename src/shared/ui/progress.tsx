"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/shared/libs";

export function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 h-1 w-full overflow-hidden rounded-none",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary/80 h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

type StepsProgressBarProps<T extends string> = {
  steps: T[];
  current: T;
  containerClassName?: string | string[];
  variant?: "default" | "password-strength";
  title?: string;
};

export function StepsProgressBar<T extends string>({
  steps,
  current,
  containerClassName,
  variant = "default",
  title,
}: StepsProgressBarProps<T>) {
  return (
    <div className={`flex items-center ${containerClassName ?? ""}`}>
      {title && <div className="mr-4 text-xs">{title}</div>}
      <div className="flex flex-grow gap-4">
        {steps.map((step) => {
          let color = "bg-muted";

          if (variant === "password-strength") {
            if (steps.indexOf(step) <= steps.indexOf(current)) {
              if (current === "very-weak") color = "bg-red-500";
              else if (current === "weak") color = "bg-orange-500";
              else if (current === "medium") color = "bg-yellow-500";
              else if (current === "strong") color = "bg-green-500";
            }
          } else {
            if (step === current) color = "bg-primary";
          }

          return <div key={step} className={cn("h-2 w-full rounded", color)} />;
        })}
      </div>
    </div>
  );
}
