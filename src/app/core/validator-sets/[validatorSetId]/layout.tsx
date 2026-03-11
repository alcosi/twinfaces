"use client";

import { ReactNode, use } from "react";

import { ValidatorSetContextProvider } from "@/features/validator-set";

type ValidatorSetLayoutProps = {
  params: Promise<{
    validatorSetId: string;
  }>;
  children: ReactNode;
};

export default function ValidatorSetLayout(props: ValidatorSetLayoutProps) {
  const params = use(props.params);

  const { validatorSetId } = params;
  const { children } = props;

  return (
    <ValidatorSetContextProvider validatorSetId={validatorSetId}>
      {children}
    </ValidatorSetContextProvider>
  );
}
