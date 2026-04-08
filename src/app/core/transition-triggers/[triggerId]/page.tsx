"use client";

import { use } from "react";

import { TransitionTriggerProvider } from "@/features/transition-trigger";
import { TransitionTriggerScreen } from "@/screens/transition-trigger";

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
