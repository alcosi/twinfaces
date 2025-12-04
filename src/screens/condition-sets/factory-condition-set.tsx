"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryConditionSetGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryConditionSetGeneral />,
  },
];

export function FactoryConditionSetScreen() {
  return <TabsLayout tabs={tabs} />;
}
