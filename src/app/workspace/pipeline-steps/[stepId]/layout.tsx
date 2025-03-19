import { ReactNode } from "react";

import { PipelineStepContextProvider } from "@/features/pipeline-step";

type PipelineStepLayoutProps = {
  params: {
    stepId: string;
  };
  children: ReactNode;
};

export default function PipelineStepLayout({
  params: { stepId },
  children,
}: PipelineStepLayoutProps) {
  return (
    <PipelineStepContextProvider stepId={stepId}>
      {children}
    </PipelineStepContextProvider>
  );
}
