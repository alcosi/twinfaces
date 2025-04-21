"use client";

import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

import {
  TwinClassContextProvider,
  TwinClassLayoutProps,
} from "@/entities/twin-class";
import { TwinFlowContextProvider } from "@/features/twin-flow";

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
