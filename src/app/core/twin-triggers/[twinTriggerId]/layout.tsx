"use client";

import { ReactNode, use } from "react";

import { TwinTriggerContextProvider } from "@/features/twin-trigger";

type TwinTriggerLayoutProps = {
  params: Promise<{
    twinTriggerId: string;
  }>;
  children: ReactNode;
};

export default function TwinTriggerLayout(props: TwinTriggerLayoutProps) {
  const params = use(props.params);

  const { twinTriggerId } = params;

  const { children } = props;

  return (
    <TwinTriggerContextProvider twinTriggerId={twinTriggerId}>
      {children}
    </TwinTriggerContextProvider>
  );
}
