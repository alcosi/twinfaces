"use client";

import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

import {
  TwinClassContextProvider,
  TwinClassLayoutProps,
} from "@/entities/twin-class";

export default function TwinClassLayout({ children }: PropsWithChildren) {
  const params = useParams<TwinClassLayoutProps["params"]>();

  return params ? (
    <TwinClassContextProvider params={params}>
      {children}
    </TwinClassContextProvider>
  ) : null;
}
