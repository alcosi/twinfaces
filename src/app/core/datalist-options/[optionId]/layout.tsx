"use client";

import { ReactNode, use } from "react";

import { DataListOptionContextProvider } from "@/features/datalist-option";

type DataListOptionLayoutProps = {
  params: Promise<{
    optionId: string;
  }>;
  children: ReactNode;
};

export default function DataListOptionLayout(props: DataListOptionLayoutProps) {
  const params = use(props.params);

  const { optionId } = params;

  const { children } = props;

  return (
    <DataListOptionContextProvider optionId={optionId}>
      {children}
    </DataListOptionContextProvider>
  );
}
