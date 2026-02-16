"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinClassDynamicMarkerGeneral } from "./views";

export function TwinClassDynamicMarkerScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinClassDynamicMarkerGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
