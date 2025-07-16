"use client";

import { useContext } from "react";

import { TwinFlowContext } from "@/features/twin-flow";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinFlowTransitionsTable } from "@/widgets/tables";

import { TwinFlowGeneral } from "./views";

export function TwinFlowScreen() {
  const { twinFlow } = useContext(TwinFlowContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <TwinFlowGeneral />,
    },
    {
      key: "transitions",
      label: "Transitions",
      content: <TwinFlowTransitionsTable twinflow={twinFlow} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
