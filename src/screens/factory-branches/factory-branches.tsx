"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { FactoryBranchesTable } from "@/widgets/tables";

export function FactoryBranchesScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Branches", href: `/${PlatformArea.core}/branches` },
    ]);
  }, [setBreadcrumbs]);

  return <FactoryBranchesTable />;
}
