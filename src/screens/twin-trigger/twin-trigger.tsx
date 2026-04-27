"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinTriggerGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <TwinTriggerGeneral />,
  },
];

export function TwinTriggerScreen() {
  return <TabsLayout tabs={tabs} />;
}
