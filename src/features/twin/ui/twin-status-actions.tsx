"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Twin_DETAILED } from "@/entities/twin/server";
import { isTruthy } from "@/shared/libs";

import { TwinClassStatusResourceLink } from "../../../features/twin-status/ui";
import { TransitionPerformer } from "../../twin-flow-transition";

type Props = {
  twin: Twin_DETAILED;
  disabledLinkNavigation?: boolean;
  onTransitionSuccess?: () => void;
};

export function TwinStatusActions({
  twin,
  disabledLinkNavigation = false,
  onTransitionSuccess,
}: Props) {
  const router = useRouter();

  async function handleOnSuccess() {
    try {
      router.refresh();
      toast.success("Transition is performed successfully");
    } catch (error) {
      toast.error("Error performing transition");
      throw error;
    }
  }

  const handleSuccess = async () => {
    if (onTransitionSuccess) {
      onTransitionSuccess();
    } else {
      await handleOnSuccess();
    }
  };

  return (
    <>
      <TwinClassStatusResourceLink
        twinClassId={twin.twinClassId!}
        data={twin.status!}
        disabled={isTruthy(disabledLinkNavigation)}
      />
      {twin.transitions && (
        <TransitionPerformer twin={twin} onSuccess={handleSuccess} />
      )}
    </>
  );
}
