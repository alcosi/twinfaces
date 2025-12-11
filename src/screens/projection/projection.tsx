"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { ProjectionGeneral } from "./view";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <ProjectionGeneral />,
  },
];

export function ProjectionScreen() {
  return <TabsLayout tabs={tabs} />;
}
