"use client";

import { useContext } from "react";

import { TwinFlowContext } from "@/features/twin-flow";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinFlowTransitionsTable } from "@/widgets/tables";
import { TwinFlowFactoriesTable } from "@/widgets/tables/twinflow-factories";

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
    {
      key: "twinflowFactories",
      label: "Twinflow factories",
      content: (
        <TwinFlowFactoriesTable
          twinflowId={twinFlow.id}
          title="Twinflow factories"
        />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
