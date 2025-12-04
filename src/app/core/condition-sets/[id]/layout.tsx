"use client";

import { ReactNode, use } from "react";

import { FactoryConditionSetProvider } from "@/features/factory-condition-set";

type LayoutProps = {
  params: Promise<{
    id: string;
  }>;
  children: ReactNode;
};

export default function ConditionSetLayout(props: LayoutProps) {
  const { children } = props;

  const { id } = use(props.params);

  return (
    <FactoryConditionSetProvider id={id}>
      {children}
    </FactoryConditionSetProvider>
  );
}
