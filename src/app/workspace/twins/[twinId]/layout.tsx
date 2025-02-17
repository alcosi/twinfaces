"use client";

import { TwinContextProvider } from "./twin-context";
import React from "react";

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
