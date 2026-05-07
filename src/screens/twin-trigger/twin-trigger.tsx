"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinTriggerGeneral, TwinTriggerUsages } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <TwinTriggerGeneral />,
  },
  {
    key: "usages",
    label: "Usages",
    content: <TwinTriggerUsages />,
  },
];

export function TwinTriggerScreen() {
  return <TabsLayout tabs={tabs} />;
}
