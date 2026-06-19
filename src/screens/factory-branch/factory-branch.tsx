"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryBranchGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryBranchGeneral />,
  },
];

export function FactoryBranchScreen({ rightSlot }: { rightSlot?: ReactNode }) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
