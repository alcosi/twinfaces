"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { PermissionSchemaGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PermissionSchemaGeneral />,
  },
];

export function PermissionSchemaScreen() {
  return <TabsLayout tabs={tabs} />;
}
