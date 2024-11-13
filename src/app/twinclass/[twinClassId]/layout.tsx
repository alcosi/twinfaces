"use client";

import {
  TwinClassContextProvider,
  TwinClassLayoutProps,
} from "@/app/twinclass/[twinClassId]/twin-class-context";
import { TwinFlowContextProvider } from "@/features/twinFlow";
import { useParams } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default function TwinClassLayout({ children }: PropsWithChildren) {
  const params = useParams<TwinClassLayoutProps["params"]>();

  return params ? (
    <TwinClassContextProvider params={params}>
      <TwinFlowContextProvider params={params}>
        {children}
      </TwinFlowContextProvider>
    </TwinClassContextProvider>
  ) : null;
}
