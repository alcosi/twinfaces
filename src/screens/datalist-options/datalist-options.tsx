"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { DatalistOptionsTable } from "@/widgets/tables";

export function DatalistOptionsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Options", href: `/${PlatformArea.core}/datalist-options` },
    ]);
  }, [setBreadcrumbs]);

  return <DatalistOptionsTable />;
}
