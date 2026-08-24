"use client";

import { ReactNode, use } from "react";

import { TwinValidatorContextProvider } from "@/features/twin-validator";

type TwinValidatorLayoutProps = {
  params: Promise<{ validatorId: string }>;
  children: ReactNode;
};

export default function TwinValidatorLayout(props: TwinValidatorLayoutProps) {
  const { validatorId } = use(props.params);

  return (
    <TwinValidatorContextProvider twinValidatorId={validatorId}>
      {props.children}
    </TwinValidatorContextProvider>
  );
}
