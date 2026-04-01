"use client";

import { ReactNode, use } from "react";

import { FactoryMultiplierFilterContextProvider } from "@/features/factory-multiplier-filter";

type FactoryMultiplierFilterLayoutProps = {
  params: Promise<{
    multiplierFilterId: string;
  }>;
  children: ReactNode;
};

export default function FactoryMultiplierFilterLayout(
  props: FactoryMultiplierFilterLayoutProps
) {
  const params = use(props.params);
  const { multiplierFilterId } = params;
  const { children } = props;

  return (
    <FactoryMultiplierFilterContextProvider
      factoryMultiplierFilterId={multiplierFilterId}
    >
      {children}
    </FactoryMultiplierFilterContextProvider>
  );
}
