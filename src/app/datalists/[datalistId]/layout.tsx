"use client";

import React from "react";
import { DatalistContextProvider } from "@/app/datalists/[datalistId]/datalist-context";

interface DatalistLayoutProps {
  params: {
    datalistId: string;
  };
  children: React.ReactNode;
}

export default function DatalistLayout({
  params: { datalistId },
  children,
}: DatalistLayoutProps) {
  return (
    <DatalistContextProvider datalistId={datalistId}>
      {children}
    </DatalistContextProvider>
  );
}
