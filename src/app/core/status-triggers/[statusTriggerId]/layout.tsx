"use client";

import { ReactNode, use } from "react";

import { StatusTriggerContextProvider } from "@/features/status-trigger";

type StatusTriggerLayoutProps = {
  params: Promise<{
    statusTriggerId: string;
  }>;
  children: ReactNode;
};

export default function StatusTriggerLayout(props: StatusTriggerLayoutProps) {
  const params = use(props.params);

  const { statusTriggerId } = params;

  const { children } = props;

  return (
    <StatusTriggerContextProvider statusTriggerId={statusTriggerId}>
      {children}
    </StatusTriggerContextProvider>
  );
}
