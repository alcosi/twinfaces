"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { NotificationGeneral } from "./view";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <NotificationGeneral />,
  },
];

export function NotificationScreen() {
  return <TabsLayout tabs={tabs} />;
}
