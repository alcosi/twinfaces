"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { RecipientCollectorsTable } from "@/widgets/tables/recipient-collectors/recipient-collectors";

import { RecipientGeneral } from "../recipient/view/recipient-general";

export function RecipientScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <RecipientGeneral />,
    },
    {
      key: "collectors",
      label: "Сollectors",
      content: <RecipientCollectorsTable />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
