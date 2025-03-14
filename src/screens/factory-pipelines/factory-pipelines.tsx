"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { FactoryPipelinesTable } from "@/widgets/tables";

export function FactoryPipelinesScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Pipelines", href: `/${PlatformArea.core}/pipelines` },
    ]);
  }, []);

  return <FactoryPipelinesTable />;
}
