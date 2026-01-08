"use client";

import { useContext } from "react";

import { TwinFlowFactoryContext } from "@/features/twinflow-factory";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinFlowFactoryGeneral } from "./views";

export function TwinFlowFactoryScreen() {
  const { twinflowFactory, refresh } = useContext(TwinFlowFactoryContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: (
        <TwinFlowFactoryGeneral
          twinflowFactory={twinflowFactory}
          onUpdate={refresh}
        />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
