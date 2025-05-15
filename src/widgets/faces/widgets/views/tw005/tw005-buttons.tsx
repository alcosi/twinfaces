"use client";

import Image from "next/image";

import { FaceTW005 } from "@/entities/face";
import { TransitionPerformButton } from "@/features/twin-flow-transition/transition-perform-button";
import { cn } from "@/shared/libs";

type Props = {
  transitions: NonNullable<FaceTW005["buttons"]>;
  twinId: string;
  className?: string | string[];
};

export function TW005Buttons({ transitions, twinId, className }: Props) {
  return (
    <div className={cn("flex gap-2", className)}>
      {transitions.map(({ id, transitionId, label, icon }) => {
        const Icon = icon
          ? () => (
              <Image
                src={icon}
                alt="icon"
                width={16}
                height={16}
                className="mr-2 dark:invert"
              />
            )
          : undefined;

        return (
          <TransitionPerformButton
            key={id}
            twinId={twinId}
            transitionId={transitionId!}
            IconComponent={Icon}
          >
            {label}
          </TransitionPerformButton>
        );
      })}
    </div>
  );
}
