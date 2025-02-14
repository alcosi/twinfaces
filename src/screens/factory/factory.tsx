"use client";

import { FactoryContext } from "@/entities/factory";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab } from "@/widgets/layout";
import { useContext, useEffect } from "react";
import { TabsLayout } from "../../widgets/layout/tabs-layout/layout";
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
        href: "/workspace/factories",
      },
      {
        label: factory?.name!,
        href: `/workspace/factories/${factoryId}`,
      },
    ]);
  }, [factoryId, factory?.name]);

  return <TabsLayout tabs={tabs} />;
}
