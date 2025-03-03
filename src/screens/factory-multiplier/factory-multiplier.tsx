"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryMultiplierContext } from "@/features/factory-multiplier";
import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryMultiplierGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryMultiplierGeneral />,
  },
];

export function FactoryMultiplierScreen() {
  const { factoryMultiplierId, factoryMultiplier } = useContext(
    FactoryMultiplierContext
  );
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Multipliers",
        href: "/workspace/multipliers",
      },
      {
        label: factoryMultiplier.factory.name
          ? factoryMultiplier.factory.name
          : factoryMultiplier.factory.key!,
        href: `/workspace/multipliers/${factoryMultiplierId}`,
      },
    ]);
  }, [
    factoryMultiplierId,
    factoryMultiplier.factory.name,
    factoryMultiplier.factory.key,
  ]);

  return <TabsLayout tabs={tabs} />;
}
