"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryEraserGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryEraserGeneral />,
  },
];

export function FactoryEraserScreen({ rightSlot }: { rightSlot?: ReactNode }) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
