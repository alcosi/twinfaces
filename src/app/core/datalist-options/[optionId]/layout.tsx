"use client";

import { ReactNode } from "react";

import { DataListOptionContextProvider } from "@/features/datalist-option";

type DataListOptionLayoutProps = {
  params: {
    optionId: string;
  };
  children: ReactNode;
};

export default function DataListOptionLayout({
  params: { optionId },
  children,
}: DataListOptionLayoutProps) {
  return (
    <DataListOptionContextProvider optionId={optionId}>
      {children}
    </DataListOptionContextProvider>
  );
}
