"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { BusinessAccountGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <BusinessAccountGeneral />,
  },
];

export function BusinessAccountScreen() {
  return <TabsLayout tabs={tabs} />;
}
