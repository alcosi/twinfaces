"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { PermissionGroupGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PermissionGroupGeneral />,
  },
];

export function PermissionGroupScreen() {
  return <TabsLayout tabs={tabs} />;
}
