"use client";

import { ReactNode, use } from "react";

import { TwinStatusContextProvider } from "@/features/twin-status";

type Props = {
  params: Promise<{
    twinStatusId: string;
  }>;
  children: ReactNode;
};

export default function Layout(props: Props) {
  const params = use(props.params);

  const { twinStatusId } = params;

  const { children } = props;

  return (
    <TwinStatusContextProvider twinStatusId={twinStatusId}>
      {children}
    </TwinStatusContextProvider>
  );
}
