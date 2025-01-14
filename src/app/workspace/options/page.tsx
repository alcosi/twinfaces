"use client";

import { DatalistOptionsScreen } from "@/screens/options";
import { useEffect } from "react";
import { useBreadcrumbs } from "@/features/breadcrumb";

export default function OptionsPage() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Options", href: "/workspace/options" }]);
  }, [setBreadcrumbs]);

  return <DatalistOptionsScreen />;
}
