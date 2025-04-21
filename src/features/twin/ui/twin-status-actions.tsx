"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Twin_DETAILED } from "@/entities/twin/server";

import { TwinClassStatusResourceLink } from "../../../features/twin-status/ui";
import { TransitionPerformer } from "../../twin-flow-transition";

type Props = {
  twin: Twin_DETAILED;
};

export function TwinStatusActions({ twin }: Props) {
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

  return (
    <>
      <TwinClassStatusResourceLink
        twinClassId={twin.twinClassId!}
        data={twin.status!}
      />
      {twin.transitions && (
        <TransitionPerformer twin={twin} onSuccess={handleOnSuccess} />
      )}
    </>
  );
}
