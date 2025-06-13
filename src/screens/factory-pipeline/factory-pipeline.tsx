"use client";

import { useContext } from "react";

import { FactoryPipelineContext } from "@/features/factory-pipeline";
import { Tab, TabsLayout } from "@/widgets/layout";
import { PipelineStepsTable } from "@/widgets/tables";

import { FactoryPipelineGeneral } from "./views";

export function FactoryPipelineScreen() {
  const { pipelineId } = useContext(FactoryPipelineContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <FactoryPipelineGeneral />,
    },
    {
      key: "steps",
      label: "Steps",
      content: <PipelineStepsTable pipelineId={pipelineId} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
