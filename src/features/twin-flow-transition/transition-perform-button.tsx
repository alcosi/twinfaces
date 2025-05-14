"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import * as React from "react";
import { toast } from "sonner";

import { usePerformTransition } from "@/entities/twin-flow-transition/api/hooks/use-perform-transition";
import { Button, ButtonProps } from "@/shared/ui/button";

type Props = ButtonProps & {
  twinId: string;
  transitionId: string;
};

export function TransitionPerformButton({
  twinId,
  transitionId,
  Icon,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const router = useRouter();
  const { performTransition, loading } = usePerformTransition();

  async function handleClick() {
    try {
      await performTransition({
        transitionId,
        body: { twinId },
      });

      router.refresh();
    } catch {
      toast.error("Failed to perform transition due to API error");
    }
  }

  return (
    <Button
      variant="outline"
      key={transitionId}
      onClick={handleClick}
      loading={loading}
      Icon={Icon}
      {...rest}
    >
      {children}
    </Button>
  );
}
