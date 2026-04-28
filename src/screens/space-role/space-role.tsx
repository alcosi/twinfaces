"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { SpaceRoleGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <SpaceRoleGeneral />,
  },
];

export function SpaceRoleScreen() {
  return <TabsLayout tabs={tabs} />;
}
