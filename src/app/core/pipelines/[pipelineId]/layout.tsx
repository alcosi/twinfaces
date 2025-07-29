"use client";

import { ReactNode, use } from "react";

import { FactoryPipelineContextProvider } from "@/features/factory-pipeline";

type FactoryPipelineLayoutProps = {
  params: Promise<{
    pipelineId: string;
  }>;
  children: ReactNode;
};

export default function FactoryPipelineLayout(
  props: FactoryPipelineLayoutProps
) {
  const params = use(props.params);

  const { pipelineId } = params;

  const { children } = props;

  return (
    <FactoryPipelineContextProvider pipelineId={pipelineId}>
      {children}
    </FactoryPipelineContextProvider>
  );
}
