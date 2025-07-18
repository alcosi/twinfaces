"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Twin_DETAILED } from "@/entities/twin/server";
import { isPopulatedArray } from "@/shared/libs";

import { TwinClassStatusResourceLink } from "../../../features/twin-status/ui";
import { TransitionPerformer } from "../../twin-flow-transition";

type Props = {
  twin: Twin_DETAILED;
  allowNavigation?: boolean;
  onTransitionSuccess?: () => void;
};

export function TwinStatusActions({
  twin,
  allowNavigation = true,
  onTransitionSuccess,
}: Props) {
  const router = useRouter();

  async function handleSuccess() {
    try {
      if (onTransitionSuccess) {
        onTransitionSuccess();
      } else {
        router.refresh();
        toast.success("Transition performed successfully");
      }
    } catch (err) {
      toast.error("Error performing transition");
      throw err;
    }
  }

  return (
    <div className="flex items-center gap-2">
      <TwinClassStatusResourceLink
        twinClassId={twin.twinClassId!}
        data={twin.status!}
        disabled={allowNavigation}
      />
      {isPopulatedArray(twin.transitions) && (
        <TransitionPerformer twin={twin} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
