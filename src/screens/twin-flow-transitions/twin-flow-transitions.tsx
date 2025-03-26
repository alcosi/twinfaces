"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { TwinFlowTransitionsTable } from "@/widgets/tables";

export function TransitionsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Transitions", href: `${PlatformArea.core}/transitions` },
    ]);
  }, [setBreadcrumbs]);

  return <TwinFlowTransitionsTable />;
}
