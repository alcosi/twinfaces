"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { TiersTable } from "@/widgets/tables/tiers";

export function TiersScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Tiers", href: `/${PlatformArea.core}/tiers` }]);
  }, [setBreadcrumbs]);

  return <TiersTable />;
}
