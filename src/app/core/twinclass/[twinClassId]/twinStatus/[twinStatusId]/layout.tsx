"use client";

import { ReactNode } from "react";

import { TwinStatusContextProvider } from "@/features/twin-status";

type Props = {
  params: {
    twinStatusId: string;
  };
  children: ReactNode;
};

export default function Layout({ params: { twinStatusId }, children }: Props) {
  return (
    <TwinStatusContextProvider twinStatusId={twinStatusId}>
      {children}
    </TwinStatusContextProvider>
  );
}
