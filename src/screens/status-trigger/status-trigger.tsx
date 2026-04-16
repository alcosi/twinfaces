"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { StatusTriggerGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <StatusTriggerGeneral />,
  },
];

export function StatusTriggerScreen() {
  return <TabsLayout tabs={tabs} />;
}
