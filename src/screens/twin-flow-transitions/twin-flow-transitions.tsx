"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";
import { TwinFlowTransitionsTable } from "@/widgets/tables";

export function TransitionsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Transitions", href: "/workspace/transitions" }]);
  }, [setBreadcrumbs]);

  return <TwinFlowTransitionsTable />;
}
