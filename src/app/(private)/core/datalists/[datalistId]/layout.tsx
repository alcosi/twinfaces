"use client";

import React from "react";

import { DatalistContextProvider } from "@/features/datalist";

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
