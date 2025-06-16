"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryBranchGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryBranchGeneral />,
  },
];

export function FactoryBranchScreen() {
  return <TabsLayout tabs={tabs} />;
}
