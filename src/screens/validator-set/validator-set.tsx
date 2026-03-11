"use client";

import { Tab, TabsLayout } from "@/widgets/layout";

import { ValidatorSetGeneral } from "./views";

export function ValidatorSetScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <ValidatorSetGeneral />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
