"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { TierGeneral } from "./view";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <TierGeneral />,
  },
];

export function TierScreen() {
  return <TabsLayout tabs={tabs} />;
}
