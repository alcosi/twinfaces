"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { FactoryPipelineGeneral } from "./views";
import { useContext, useEffect } from "react";
import { FactoryPipelineContext } from "@/features/factory-pipeline";
import { useBreadcrumbs } from "@/features/breadcrumb";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryPipelineGeneral />,
  },
];

export function FactoryPipelineScreen() {
  const { pipelineId, pipeline } = useContext(FactoryPipelineContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Pipelines",
        href: "/workspace/pipelines",
      },
      {
        label: pipeline.factory.name
          ? pipeline.factory.name
          : pipeline.factory.key!,
        href: `/workspace/pipelines/${pipelineId}`,
      },
    ]);
  }, [pipelineId, pipeline.factory.name]);

  return <TabsLayout tabs={tabs} />;
}
