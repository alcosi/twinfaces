"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PipelineStepsTable } from "@/widgets/tables";

export function PipelineStepsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Pipeline Steps", href: "/workspace/pipeline-steps" },
    ]);
  }, [setBreadcrumbs]);

  return <PipelineStepsTable />;
}
