"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowTransitionsTable } from "@/widgets/tables";

export function TransitionsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Transitions", href: "/workspace/transitions" }]);
  }, [setBreadcrumbs]);

  return <TwinFlowTransitionsTable />;
}
