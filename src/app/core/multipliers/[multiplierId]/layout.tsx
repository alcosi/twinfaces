"use client";

import { ReactNode, use } from "react";

import { FactoryMultiplierContextProvider } from "@/features/factory-multiplier";

type FactoryMultiplierLayoutProps = {
  params: Promise<{
    multiplierId: string;
  }>;
  children: ReactNode;
};

export default function FactoryMultiplierLayout(
  props: FactoryMultiplierLayoutProps
) {
  const params = use(props.params);

  const { multiplierId } = params;

  const { children } = props;

  return (
    <FactoryMultiplierContextProvider factoryMultiplierId={multiplierId}>
      {children}
    </FactoryMultiplierContextProvider>
  );
}
