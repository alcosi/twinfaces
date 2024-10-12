"use client";

import { TwinClassContextProvider } from "@/app/twinclass/[twinClassId]/twin-class-context";
import React from "react";

interface TwinClassLayoutProps {
  params: {
    twinClassId: string;
  };
  children: React.ReactNode;
}
export default function TwinClassLayout({
  params: { twinClassId },
  children,
}: TwinClassLayoutProps) {
  return (
    <TwinClassContextProvider twinClassId={twinClassId}>
      {children}
    </TwinClassContextProvider>
  );
}
