"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryMultiplierFilterGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryMultiplierFilterGeneral />,
  },
];

export function FactoryMultiplierFilterScreen() {
  return <TabsLayout tabs={tabs} />;
}
