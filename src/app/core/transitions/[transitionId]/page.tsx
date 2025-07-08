"use client";

import { use } from "react";

import { TwinFlowTransitionContextProvider } from "@/features/twin-flow-transition";
import { TransitionScreen } from "@/screens/transition";

type Props = {
  params: Promise<{
    transitionId: string;
  }>;
};

export default function Page({ params }: Props) {
  const { transitionId } = use(params);

  return (
    <TwinFlowTransitionContextProvider transitionId={transitionId}>
      <TransitionScreen />
    </TwinFlowTransitionContextProvider>
  );
}
