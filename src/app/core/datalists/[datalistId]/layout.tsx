"use client";

import React, { use } from "react";

import { DatalistContextProvider } from "@/features/datalist";

interface DatalistLayoutProps {
  params: Promise<{
    datalistId: string;
  }>;
  children: React.ReactNode;
}

export default function DatalistLayout(props: DatalistLayoutProps) {
  const params = use(props.params);

  const { datalistId } = params;

  const { children } = props;

  return (
    <DatalistContextProvider datalistId={datalistId}>
      {children}
    </DatalistContextProvider>
  );
}
