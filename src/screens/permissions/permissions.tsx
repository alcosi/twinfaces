"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { PermissionsTable } from "@/widgets/tables";

export function PermissionsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Permissions", href: `/${PlatformArea.core}/permissions` },
    ]);
  }, []);

  return <PermissionsTable />;
}
