"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryConditionGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryConditionGeneral />,
  },
];

export function FactoryConditionScreen() {
  return <TabsLayout tabs={tabs} />;
}
