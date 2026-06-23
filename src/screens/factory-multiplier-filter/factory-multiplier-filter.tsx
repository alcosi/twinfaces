"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryMultiplierFilterGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryMultiplierFilterGeneral />,
  },
];

export function FactoryMultiplierFilterScreen({
  rightSlot,
}: {
  rightSlot?: ReactNode;
}) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
