"use client";

import { TwinStatusesScreen } from "@/screens/statuses";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";

export default function StatusesPage() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Statuses", href: "/workspace/statuses" }]);
  }, []);

  return <TwinStatusesScreen />;
}
