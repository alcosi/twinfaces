"use client";

import { ReactNode, use } from "react";

import { LinkContextProvider } from "@/features/link";

type LinkLayoutProps = {
  params: Promise<{
    linkId: string;
  }>;
  children: ReactNode;
};

export default function LinkLayout(props: LinkLayoutProps) {
  const params = use(props.params);

  const { linkId } = params;

  const { children } = props;

  return <LinkContextProvider linkId={linkId}>{children}</LinkContextProvider>;
}
