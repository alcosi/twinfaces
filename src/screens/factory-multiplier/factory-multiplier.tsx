"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryMultiplierFilters, FactoryMultiplierGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryMultiplierGeneral />,
  },
  {
    key: "filters",
    label: "Filters",
    content: <FactoryMultiplierFilters />,
  },
];

export function FactoryMultiplierScreen({
  rightSlot,
}: {
  rightSlot?: ReactNode;
}) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
