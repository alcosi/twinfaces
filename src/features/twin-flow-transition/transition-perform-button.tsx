"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
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
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { performTransition } = usePerformTransition();

  async function handleClick() {
    setLoading(true);
    try {
      await performTransition({
        transitionId: transitionId,
        body: { twinId: twinId },
      });

      router.refresh();
    } catch {
      toast.error("Failed to perform transition due to API error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      key={transitionId}
      onClick={handleClick}
      loading={loading}
      {...rest}
    >
      {children}
    </Button>
  );
}
