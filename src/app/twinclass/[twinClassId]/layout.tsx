"use client";

import {
  TwinClassContextProvider,
  TwinClassLayoutProps,
} from "@/app/twinclass/[twinClassId]/twin-class-context";
import { useParams } from "next/navigation";
import React, { PropsWithChildren } from "react";

export default function TwinClassLayout({ children }: PropsWithChildren) {
  const params = useParams<TwinClassLayoutProps["params"]>();

  return params ? (
    <TwinClassContextProvider params={params}>
      {children}
    </TwinClassContextProvider>
  ) : null;
}
