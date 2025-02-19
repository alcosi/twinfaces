"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryBranchContext } from "@/features/factory-branch";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect } from "react";
import { FactoryBranchGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <FactoryBranchGeneral />,
  },
];

export function FactoryBranchScreen() {
  const { factoryBranchId, factoryBranch } = useContext(FactoryBranchContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Branches",
        href: "/workspace/branches",
      },
      {
        label: factoryBranch.factory.name
          ? factoryBranch.factory.name
          : factoryBranch.factory.key!,
        href: `/workspace/branches/${factoryBranchId}`,
      },
    ]);
  }, [factoryBranchId, factoryBranch.factory.name, factoryBranch.factory.key]);

  return <TabsLayout tabs={tabs} />;
}
