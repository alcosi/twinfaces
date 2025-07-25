"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { GeneralSection, GrantSection } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <GeneralSection />,
  },
  {
    key: "grant",
    label: "Grant",
    content: <GrantSection />,
  },
];

export function PermissionScreen() {
  return <TabsLayout tabs={tabs} />;
}
