"use client";

import { FactoryPipelineContextProvider } from "@/features/factory-pipeline";
import { ReactNode } from "react";

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
