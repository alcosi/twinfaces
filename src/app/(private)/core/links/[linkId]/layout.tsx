"use client";

import { ReactNode } from "react";

import { LinkContextProvider } from "@/features/link";

type LinkLayoutProps = {
  params: {
    linkId: string;
  };
  children: ReactNode;
};

export default function LinkLayout({
  params: { linkId },
  children,
}: LinkLayoutProps) {
  return <LinkContextProvider linkId={linkId}>{children}</LinkContextProvider>;
}
