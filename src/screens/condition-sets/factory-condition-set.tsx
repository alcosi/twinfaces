"use client";

import { useContext } from "react";

import { FactoryConditionSetContext } from "@/features/factory-condition-set";
import { Tab, TabsLayout } from "@/widgets/layout";
import { FactoryConditionsTable } from "@/widgets/tables";

import { FactoryConditionSetGeneral } from "./views";

export function FactoryConditionSetScreen() {
  const { factoryConditionSet } = useContext(FactoryConditionSetContext);
  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <FactoryConditionSetGeneral />,
    },
    {
      key: "condition",
      label: "Condition",
      content: (
        <FactoryConditionsTable
          factoryConditionSetId={factoryConditionSet.id}
        />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
