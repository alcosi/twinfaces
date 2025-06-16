"use client";

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
  return <TabsLayout tabs={tabs} />;
}
