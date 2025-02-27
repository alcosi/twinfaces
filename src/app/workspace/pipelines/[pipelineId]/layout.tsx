"use client";

import { ReactNode } from "react";

import { FactoryPipelineContextProvider } from "@/features/factory-pipeline";

type FactoryPipelineLayoutProps = {
  params: {
    pipelineId: string;
  };
  children: ReactNode;
};

export default function FactoryPipelineLayout({
  params: { pipelineId },
  children,
}: FactoryPipelineLayoutProps) {
  return (
    <FactoryPipelineContextProvider pipelineId={pipelineId}>
      {children}
    </FactoryPipelineContextProvider>
  );
}
