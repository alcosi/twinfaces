"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { TransitionTriggerGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <TransitionTriggerGeneral />,
  },
];

export function TransitionTriggerScreen() {
  return <TabsLayout tabs={tabs} />;
}
