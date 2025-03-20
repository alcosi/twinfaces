"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryMultiplierContext } from "@/features/factory-multiplier";
import { PlatformArea } from "@/shared/config";
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
        href: `/${PlatformArea.core}/multiplier`,
      },
      {
        label: factoryMultiplier.factory.name
          ? factoryMultiplier.factory.name
          : factoryMultiplier.factory.key!,
        href: `/${PlatformArea.core}/multipliers/${factoryMultiplierId}`,
      },
    ]);
  }, [
    factoryMultiplierId,
    factoryMultiplier.factory.name,
    factoryMultiplier.factory.key,
  ]);

  return <TabsLayout tabs={tabs} />;
}
