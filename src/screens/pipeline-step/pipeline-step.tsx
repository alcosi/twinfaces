"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PipelineStepContext } from "@/features/pipeline-step";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { PipelineStepGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PipelineStepGeneral />,
  },
];

export function PipelineStepScreen() {
  const { stepId, step } = useContext(PipelineStepContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Pipeline Steps",
        href: `/${PlatformArea.core}/pipeline-steps`,
      },
      {
        label:
          step.factoryPipeline.factory?.name ||
          step.factoryPipeline.factory?.key!,
        href: `/${PlatformArea.core}/pipeline-steps/${stepId}`,
      },
    ]);
  }, [
    stepId,
    step.factoryPipeline.factory?.name || step.factoryPipeline.factory?.key!,
    setBreadcrumbs,
  ]);

  return <TabsLayout tabs={tabs} />;
}
