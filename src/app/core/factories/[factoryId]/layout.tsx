"use client";

import { ReactNode, use } from "react";

import { FactoryContextProvider } from "@/features/factory";

type FactoryLayoutProps = {
  params: Promise<{
    factoryId: string;
  }>;
  children: ReactNode;
};

export default function FactoryLayout(props: FactoryLayoutProps) {
  const params = use(props.params);

  const { factoryId } = params;

  const { children } = props;

  return (
    <FactoryContextProvider factoryId={factoryId}>
      {children}
    </FactoryContextProvider>
  );
}
