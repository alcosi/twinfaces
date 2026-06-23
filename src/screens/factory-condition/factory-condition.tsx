"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryConditionGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryConditionGeneral />,
  },
];

export function FactoryConditionScreen({
  rightSlot,
}: {
  rightSlot?: ReactNode;
}) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
