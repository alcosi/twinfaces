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
          "transform-3d absolute h-full w-full transition-transform duration-500 ease-in-out",
          {
            "rotate-y-0": !isFlipped,
            "rotate-y-180": isFlipped,
          }
        )}
      >
        <Card className="backface-hidden absolute inset-0">{front}</Card>

        <Card className="backface-hidden rotate-y-180 absolute inset-0">
          {back}
        </Card>
      </div>
    </div>
  );
}
