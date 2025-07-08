import { ReactNode } from "react";

import { PipelineStepContextProvider } from "@/features/pipeline-step";

type PipelineStepLayoutProps = {
  params: Promise<{
    stepId: string;
  }>;
  children: ReactNode;
};

export default async function PipelineStepLayout(
  props: PipelineStepLayoutProps
) {
  const params = await props.params;

  const { stepId } = params;

  const { children } = props;

  return (
    <PipelineStepContextProvider stepId={stepId}>
      {children}
    </PipelineStepContextProvider>
  );
}
