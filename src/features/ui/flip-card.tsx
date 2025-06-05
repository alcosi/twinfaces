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
        <Card className="absolute inset-0 h-fit backface-hidden">{front}</Card>

        <Card className="absolute inset-0 h-fit rotate-y-180 backface-hidden">
          {back}
        </Card>
      </div>
    </div>
  );
}
