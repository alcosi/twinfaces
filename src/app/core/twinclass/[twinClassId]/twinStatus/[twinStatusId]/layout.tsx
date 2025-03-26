"use client";

import { ReactNode } from "react";

import { TwinStatusContextProvider } from "@/features/twin-status";

type TwinStatusLayoutProps = {
  params: {
    twinStatusId: string;
  };
  children: ReactNode;
};

export default function FactoryMultiplierLayout({
  params: { twinStatusId },
  children,
}: TwinStatusLayoutProps) {
  return (
    <TwinStatusContextProvider twinStatusId={twinStatusId}>
      {children}
    </TwinStatusContextProvider>
  );
}
