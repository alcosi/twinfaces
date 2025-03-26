"use client";

import { ReactNode } from "react";

import { TwinFieldContextProvider } from "@/features/twin-field";

type TwinFieldLayoutProps = {
  params: {
    twinFieldId: string;
  };
  children: ReactNode;
};

export default function TwinFieldLayout({
  params: { twinFieldId },
  children,
}: TwinFieldLayoutProps) {
  return (
    <TwinFieldContextProvider twinFieldId={twinFieldId}>
      {children}
    </TwinFieldContextProvider>
  );
}
