"use client";

import { TwinContextProvider } from "@/app/twin/[twinId]/twin-context";
import { ReactNode } from "react";

interface TwinLayoutProps {
  params: {
    twinId: string;
  };
  children: ReactNode;
}

export default function TwinLayout({
  params: { twinId },
  children,
}: TwinLayoutProps) {
  return <TwinContextProvider twinId={twinId}>{children}</TwinContextProvider>;
}
