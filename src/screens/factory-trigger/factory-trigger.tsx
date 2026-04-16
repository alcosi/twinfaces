"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryTriggerGeneral } from "./views";

export function FactoryTriggerScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <FactoryTriggerGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
