"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryPipelineContext } from "@/features/factory-pipeline";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { PipelineStepsTable } from "@/widgets/tables";

import { FactoryPipelineGeneral } from "./views";

export function FactoryPipelineScreen() {
  const { pipelineId, pipeline } = useContext(FactoryPipelineContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Pipelines",
        href: `/${PlatformArea.core}/pipeline`,
      },
      {
        label: pipeline.factory.name
          ? pipeline.factory.name
          : pipeline.factory.key!,
        href: `/${PlatformArea.core}/pipelines/${pipelineId}`,
      },
    ]);
  }, [pipelineId, pipeline.factory.name, setBreadcrumbs, pipeline.factory.key]);

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
