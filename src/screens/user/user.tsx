"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { UserGeneral, UserPermissions } from "./view";

const tabs: Tab[] = [
  {
    key: "genera",
    label: "General",
    content: <UserGeneral />,
  },
  {
    key: "permissions",
    label: "Permissions",
    content: <UserPermissions />,
  },
];

export function UserScreen() {
  return <TabsLayout tabs={tabs} />;
}
