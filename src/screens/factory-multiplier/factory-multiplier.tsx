"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryMultiplierGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryMultiplierGeneral />,
  },
];

export function FactoryMultiplierScreen() {
  return <TabsLayout tabs={tabs} />;
}
