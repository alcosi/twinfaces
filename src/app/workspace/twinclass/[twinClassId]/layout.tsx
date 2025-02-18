"use client";

import {
  TwinClassContextProvider,
  TwinClassLayoutProps,
} from "@/entities/twin-class";
import { TwinFlowContextProvider } from "@/features/twinFlow";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

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
