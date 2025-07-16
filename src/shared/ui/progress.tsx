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
  activeColor?: string;
  inactiveColor?: string;
};

export function StepsProgressBar<T extends string>({
  steps,
  current,
  containerClassName,
  activeColor = "bg-primary",
  inactiveColor = "bg-muted",
}: StepsProgressBarProps<T>) {
  const currentIndex = steps.indexOf(current);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={steps.length - 1}
      aria-valuenow={currentIndex}
      className={`flex items-center ${containerClassName ?? ""}`}
    >
      <div className="flex flex-grow gap-4">
        {steps.map((step, stepIndex) => {
          return (
            <div
              key={step}
              className={cn(
                "bg-muted h-2 w-full rounded",
                stepIndex <= currentIndex ? activeColor : inactiveColor
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
