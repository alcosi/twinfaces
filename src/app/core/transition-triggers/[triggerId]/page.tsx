"use client";

import { use } from "react";

import { TransitionTriggerProvider } from "@/features/twin-transition-trigger";
import { TransitionTriggerScreen } from "@/screens/twinclassTrigger";

type Props = {
  params: Promise<{
    triggerId: string;
  }>;
};

export default function Page({ params }: Props) {
  const { triggerId } = use(params);
  return (
    <TransitionTriggerProvider id={triggerId}>
      <TransitionTriggerScreen />
    </TransitionTriggerProvider>
  );
}
