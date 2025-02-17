"use client";

import { DatalistOptionsTable } from "@/widgets/tables";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";

export function DatalistOptionsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Options", href: "/workspace/datalist-options" }]);
  }, [setBreadcrumbs]);

  return <DatalistOptionsTable />;
}
