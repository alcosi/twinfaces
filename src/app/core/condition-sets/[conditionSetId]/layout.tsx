"use client";

import { ReactNode, use } from "react";

import { FactoryConditionSetProvider } from "@/features/factory-condition-set";

type LayoutProps = {
  params: Promise<{
    conditionSetId: string;
  }>;
  children: ReactNode;
};

export default function ConditionSetLayout(props: LayoutProps) {
  const { children } = props;

  const { conditionSetId } = use(props.params);

  return (
    <FactoryConditionSetProvider id={conditionSetId}>
      {children}
    </FactoryConditionSetProvider>
  );
}
