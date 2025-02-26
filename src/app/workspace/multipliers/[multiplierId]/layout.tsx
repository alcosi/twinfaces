"use client";

import { FactoryMultiplierContextProvider } from "@/features/factory-multiplier";
import { ReactNode } from "react";

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
