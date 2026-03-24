"use client";

import { ReactNode, use } from "react";

import { TierContextProvider } from "@/features/tier/context-provider";

type TierLayoutProps = {
  params: Promise<{
    tierId: string;
  }>;
  children: ReactNode;
};

export default function TierLayout(props: TierLayoutProps) {
  const params = use(props.params);

  const { tierId } = params;

  const { children } = props;

  return <TierContextProvider tierId={tierId}>{children}</TierContextProvider>;
}
