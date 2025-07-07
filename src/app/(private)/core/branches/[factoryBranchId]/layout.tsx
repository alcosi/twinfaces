"use client";

import { ReactNode } from "react";

import { FactoryBranchContextProvider } from "@/features/factory-branch";

type FactoryBranchLayoutProps = {
  params: {
    factoryBranchId: string;
  };
  children: ReactNode;
};

export default function FactoryBranchLayout({
  params: { factoryBranchId },
  children,
}: FactoryBranchLayoutProps) {
  return (
    <FactoryBranchContextProvider factoryBranchId={factoryBranchId}>
      {children}
    </FactoryBranchContextProvider>
  );
}
