"use client";

import Image from "next/image";

import { FaceTW005, FaceTW005Button } from "@/entities/face";
import { TransitionPerformButton } from "@/features/twin-flow-transition/transition-perform-button";
import { isPopulatedString, isTruthy } from "@/shared/libs";

type Props = {
  transitionButtons: NonNullable<FaceTW005["buttons"]>;
  transitionIdList: string[];
  twinId: string;
};

export function TW005Buttons({
  transitionButtons,
  transitionIdList,
  twinId,
}: Props) {
  const transitionsSet = new Set(transitionIdList);

  const availableTransitions = transitionButtons
    .reduce<typeof transitionButtons>((acc, btn) => {
      const { showWhenInactive, transitionId } = btn;

      const hasValidTransition =
        isPopulatedString(transitionId) && transitionsSet.has(transitionId);
      const shouldShowButton = hasValidTransition || showWhenInactive;

      if (shouldShowButton) {
        acc.push(btn);
      }

      return acc;
    }, [])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  function renderButton(btn: FaceTW005Button) {
    const { id, transitionId, label, icon, showWhenInactive } = btn;

    const disabled =
      showWhenInactive &&
      isTruthy(transitionId) &&
      !transitionsSet.has(transitionId);

    const Icon = isPopulatedString(icon)
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
        disabled={disabled}
      >
        {label}
      </TransitionPerformButton>
    );
  }

  return availableTransitions.map(renderButton);
}
