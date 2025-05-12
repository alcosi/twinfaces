"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

import { usePerformTransition } from "@/entities/twin-flow-transition/api/hooks/use-perform-transition";
import { Button, ButtonProps } from "@/shared/ui/button";

type Props = ButtonProps & {
  twinId: string;
  transitionId: string;
  icon?: string;
};

export function TransitionPerformButton({
  twinId,
  transitionId,
  icon,
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
      icon={icon}
      {...rest}
    >
      {children}
    </Button>
  );
}
