"use client";

import { ReactNode } from "react";

import { FactoryMultiplierContextProvider } from "@/features/factory-multiplier";

type FactoryMultiplierLayoutProps = {
  params: {
    multiplierId: string;
  };
  children: ReactNode;
};

export default function FactoryMultiplierLayout({
  params: { multiplierId },
  children,
}: FactoryMultiplierLayoutProps) {
  return (
    <FactoryMultiplierContextProvider factoryMultiplierId={multiplierId}>
      {children}
    </FactoryMultiplierContextProvider>
  );
}
