"use client";

import { ReactNode } from "react";
import { FactoryContextProvider } from "./factory-context";

interface FactoryLayoutProps {
  params: {
    factoryId: string;
  };
  children: ReactNode;
}

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
