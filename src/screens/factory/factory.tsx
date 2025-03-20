"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryContext } from "@/features/factory";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { FactoryGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryGeneral />,
  },
];

export function FactoryScreen() {
  const { factoryId, factory } = useContext(FactoryContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Factory",
        href: `/${PlatformArea.core}/factorie`,
      },
      {
        label: factory.name,
        href: `/${PlatformArea.core}/factories/${factoryId}`,
      },
    ]);
  }, [factoryId, factory.name]);

  return <TabsLayout tabs={tabs} />;
}
