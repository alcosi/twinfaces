"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect } from "react";
import { FactoryPipelineStepGeneral } from "./views";
import { PipelineStepContext } from "@/features/pipeline-step";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryPipelineStepGeneral />,
  },
];

export function PipelineStepScreen() {
  const { stepId, step } = useContext(PipelineStepContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Pipeline Steps",
        href: "/workspace/pipeline-steps",
      },
      {
        label:
          step?.factoryPipeline?.factory?.name! ||
          step?.factoryPipeline?.factory?.key!,
        href: `/workspace/pipeline-steps/${stepId}`,
      },
    ]);
  }, [
    stepId,
    step?.factoryPipeline?.factory?.name,
    step.factoryPipeline?.factory?.key,
    setBreadcrumbs,
  ]);

  return <TabsLayout tabs={tabs} />;
}
