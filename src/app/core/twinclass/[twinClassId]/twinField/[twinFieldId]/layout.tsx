"use client";

import { ReactNode, use } from "react";

import { TwinFieldContextProvider } from "@/features/twin-class-field";

type TwinFieldLayoutProps = {
  params: Promise<{
    twinFieldId: string;
  }>;
  children: ReactNode;
};

export default function TwinFieldLayout(props: TwinFieldLayoutProps) {
  const params = use(props.params);

  const { twinFieldId } = params;

  const { children } = props;

  return (
    <TwinFieldContextProvider twinFieldId={twinFieldId}>
      {children}
    </TwinFieldContextProvider>
  );
}
