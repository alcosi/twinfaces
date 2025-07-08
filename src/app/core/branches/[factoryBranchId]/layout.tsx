"use client";

import { ReactNode, use } from "react";

import { FactoryBranchContextProvider } from "@/features/factory-branch";

type FactoryBranchLayoutProps = {
  params: Promise<{
    factoryBranchId: string;
  }>;
  children: ReactNode;
};

export default function FactoryBranchLayout(props: FactoryBranchLayoutProps) {
  const params = use(props.params);

  const { factoryBranchId } = params;

  const { children } = props;

  return (
    <FactoryBranchContextProvider factoryBranchId={factoryBranchId}>
      {children}
    </FactoryBranchContextProvider>
  );
}
