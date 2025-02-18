"use client";

import { FactoryContextProvider } from "@/features/factory";
import { ReactNode } from "react";

type FactoryLayoutProps = {
  params: {
    factoryId: string;
  };
  children: ReactNode;
};

export default function FactoryLayout({
  params: { factoryId },
  children,
}: FactoryLayoutProps) {
  return (
    <FactoryContextProvider factoryId={factoryId}>
      {children}
    </FactoryContextProvider>
  );
}
