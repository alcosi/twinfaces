"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinsTable } from "@/widgets/tables";

export function TwinsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Twins", href: "/workspace/twins" }]);
  }, []);

  return <TwinsTable />;
}
