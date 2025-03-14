"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { FactoryMultipliersTable } from "@/widgets/tables";

export function FactoryMultipliersScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Multipliers", href: `/${PlatformArea.core}/multipliers` },
    ]);
  }, [setBreadcrumbs]);

  return <FactoryMultipliersTable />;
}
