"use client";

import Image from "next/image";

import { FaceTW005 } from "@/entities/face";
import { TransitionPerformButton } from "@/features/twin-flow-transition/transition-perform-button";
import { cn } from "@/shared/libs";

type Props = {
  transitionsButtons: NonNullable<FaceTW005["buttons"]>;
  transitionsIdList: string[];
  twinId: string;
  className?: string | string[];
};

export function TW005Buttons({
  transitionsButtons,
  transitionsIdList,
  twinId,
  className,
}: Props) {
  const availableTransitions = transitionsButtons
    .filter(
      (btn) =>
        (btn.transitionId && transitionsIdList.includes(btn.transitionId)) ||
        btn.showWhenInactive
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className={cn("flex gap-2", className)}>
      {availableTransitions.map(
        ({ id, transitionId, label, icon, showWhenInactive }) => {
          const isDisabled =
            showWhenInactive &&
            !!transitionId &&
            !transitionsIdList.includes(transitionId);

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
              disabled={isDisabled}
            >
              {label}
            </TransitionPerformButton>
          );
        }
      )}
    </div>
  );
}
