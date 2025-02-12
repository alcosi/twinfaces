"use client";

import { Tab, TabsLayout } from "@/widgets/layout";
import { FactoryGeneral } from "./views";
import { useContext, useEffect } from "react";
import { FactoryContext } from "./factory-context";
import { useBreadcrumbs } from "@/features/breadcrumb";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryGeneral />,
  },
];

export default function FactoryPage() {
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
