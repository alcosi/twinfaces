"use client";

import { FactoryBranchContextProvider } from "@/features/factory-branch";
import { ReactNode } from "react";

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
