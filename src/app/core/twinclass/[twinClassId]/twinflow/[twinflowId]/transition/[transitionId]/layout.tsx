"use client";

import { ReactNode } from "react";

import { TwinFlowTransitionContextProvider } from "@/features/twin-flow-transition";

type TwinFlowTransitionLayoutProps = {
  params: {
    transitionId: string;
  };
  children: ReactNode;
};

export default function TwinFlowTransitionLayout({
  params: { transitionId },
  children,
}: TwinFlowTransitionLayoutProps) {
  return (
    <TwinFlowTransitionContextProvider transitionId={transitionId}>
      {children}
    </TwinFlowTransitionContextProvider>
  );
}
