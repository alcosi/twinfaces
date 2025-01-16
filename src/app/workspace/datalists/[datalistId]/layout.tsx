"use client";

import { DatalistContextProvider } from "@/features/datalist";
import React from "react";

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
