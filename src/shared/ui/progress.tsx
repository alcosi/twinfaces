"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/shared/libs/index";

export function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 absolute z-50 h-1 w-full overflow-hidden rounded-none",
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
};

export function StepsProgressBar<T extends string>({
  steps,
  current,
  containerClassName,
}: StepsProgressBarProps<T>) {
  return (
    <div className={cn("flex gap-4", containerClassName)}>
      {steps.map((stepKey) => (
        <div
          key={stepKey}
          className={cn(
            "bg-muted h-2 w-full rounded",
            stepKey === current && "bg-primary"
          )}
        />
      ))}
    </div>
  );
}
