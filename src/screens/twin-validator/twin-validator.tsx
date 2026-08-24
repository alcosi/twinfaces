"use client";

import { ReactNode } from "react";

import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinValidatorGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <TwinValidatorGeneral />,
  },
];

export function TwinValidatorScreen({ rightSlot }: { rightSlot?: ReactNode }) {
  return <TabsLayout tabs={tabs} rightSlot={rightSlot} />;
}
