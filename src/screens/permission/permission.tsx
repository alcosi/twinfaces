"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { GeneralSection, GrantSection } from "./views";

export type PageProps = {
  params: {
    permissionId: string;
  };
};

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

export function PermissionPage({ params: { permissionId } }: PageProps) {
  return <TabsLayout tabs={tabs} />;
}
