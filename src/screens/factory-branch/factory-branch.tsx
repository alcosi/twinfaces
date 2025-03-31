"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { FactoryBranchContext } from "@/features/factory-branch";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

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
        href: `/${PlatformArea.core}/branches`,
      },
      {
        label: factoryBranch.factory.name
          ? factoryBranch.factory.name
          : factoryBranch.factory.key!,
        href: `/${PlatformArea.core}/branches/${factoryBranchId}`,
      },
    ]);
  }, [factoryBranchId, factoryBranch.factory.name, factoryBranch.factory.key]);

  return <TabsLayout tabs={tabs} />;
}
