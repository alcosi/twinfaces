"use client";

import React from "react";

import { cn } from "@/shared/libs";
import { Card } from "@/shared/ui";

type Props = {
  isFlipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
};

export function FlipCard({ isFlipped, front, back, className }: Props) {
  return (
    <div
      className={cn(
        "perspective relative max-h-[800px] min-h-[640px] w-[480px]",
        className
      )}
    >
      <div
        className={cn(
          "absolute h-full w-full transition-transform duration-500 ease-in-out transform-3d",
          {
            "rotate-y-0": !isFlipped,
            "rotate-y-180": isFlipped,
          }
        )}
      >
        <Card className="absolute inset-0 overflow-y-auto backface-hidden">
          {front}
        </Card>

        {
          //TODO find a solution to the broken layout of the form when validation errors occur (a temporary solution option is "h-fit")
        }
        <Card className="absolute inset-0 rotate-y-180 overflow-y-auto backface-hidden">
          {back}
        </Card>
      </div>
    </div>
  );
}
