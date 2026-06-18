"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryFlow, FactoryGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryGeneral />,
  },
  {
    key: "flow",
    label: "Flow",
    content: <FactoryFlow />,
  },
];

export function FactoryScreen({ rightSlot }: { rightSlot?: ReactNode }) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
