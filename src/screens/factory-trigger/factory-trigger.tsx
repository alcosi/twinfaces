"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryTriggerGeneral } from "./views";

export function FactoryTriggerScreen({ rightSlot }: { rightSlot?: ReactNode }) {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <FactoryTriggerGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
