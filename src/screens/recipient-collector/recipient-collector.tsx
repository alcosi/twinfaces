"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { RecipientColletorGeneral } from "./views";

export function RecipientCollectorScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <RecipientColletorGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
