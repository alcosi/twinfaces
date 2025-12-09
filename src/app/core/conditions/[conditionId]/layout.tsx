"use client";

import { ReactNode, use } from "react";

import { FactoryConditionContextProvider } from "@/features/factory-condition";

type FactoryConditionLayoutProps = {
  params: Promise<{
    conditionId: string;
  }>;
  children: ReactNode;
};

export default function FactoryConditionLayout(
  props: FactoryConditionLayoutProps
) {
  const params = use(props.params);

  const { conditionId } = params;

  const { children } = props;

  return (
    <FactoryConditionContextProvider factoryConditionId={conditionId}>
      {children}
    </FactoryConditionContextProvider>
  );
}
