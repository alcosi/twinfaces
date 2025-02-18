"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect } from "react";
import { FactoryGeneral } from "./views";
import { FactoryContext } from "@/features/factory";

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
        href: "/workspace/factories",
      },
      {
        label: factory.name,
        href: `/workspace/factories/${factoryId}`,
      },
    ]);
  }, [factoryId, factory.name]);

  return <TabsLayout tabs={tabs} />;
}
