"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { RecipientCollectorGeneral } from "./views";

export function RecipientCollectorScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <RecipientCollectorGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
