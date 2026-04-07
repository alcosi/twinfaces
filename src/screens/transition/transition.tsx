"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { TransitionTriggersTable } from "@/widgets/tables/transition-triggers/transition-triggers";

import { TwinflowTransitionGeneral } from "./views";

export function TransitionScreen() {
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinflowTransitionGeneral />,
    },
    {
      key: "triggers",
      label: "Triggers",
      content: <TransitionTriggersTable />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
