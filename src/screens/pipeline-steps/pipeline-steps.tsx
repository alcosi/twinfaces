"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { PipelineStepsTable } from "@/widgets/tables";

export function PipelineStepsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Pipeline Steps", href: `/${PlatformArea.core}/pipeline-steps` },
    ]);
  }, [setBreadcrumbs]);

  return <PipelineStepsTable />;
}
