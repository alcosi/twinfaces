"use client";

import React from "react";

import { TwinContextProvider } from "@/features/twin";

interface TwinLayoutProps {
  params: {
    twinId: string;
  };
  children: React.ReactNode;
}

export default function TwinLayout({
  params: { twinId },
  children,
}: TwinLayoutProps) {
  return <TwinContextProvider twinId={twinId}>{children}</TwinContextProvider>;
}
