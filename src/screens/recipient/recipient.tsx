"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { RecipientGeneral } from "../recipient/view/recipient-general";

export function RecipientScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <RecipientGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
