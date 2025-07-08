"use client";

import { ReactNode, use } from "react";

import { TwinFlowTransitionContextProvider } from "@/features/twin-flow-transition";

type TwinFlowTransitionLayoutProps = {
  params: Promise<{
    transitionId: string;
  }>;
  children: ReactNode;
};

export default function TwinFlowTransitionLayout(
  props: TwinFlowTransitionLayoutProps
) {
  const params = use(props.params);

  const { transitionId } = params;

  const { children } = props;

  return (
    <TwinFlowTransitionContextProvider transitionId={transitionId}>
      {children}
    </TwinFlowTransitionContextProvider>
  );
}
