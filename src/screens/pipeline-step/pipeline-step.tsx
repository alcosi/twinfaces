"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { PipelineStepGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PipelineStepGeneral />,
  },
];

export function PipelineStepScreen({ rightSlot }: { rightSlot?: ReactNode }) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
