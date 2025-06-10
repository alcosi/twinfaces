"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { PermissionGroupsTable } from "@/widgets/tables";

export function PermissionGroupsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Permission Groups",
        href: `/${PlatformArea.core}/permission-groups`,
      },
    ]);
  }, []);

  return <PermissionGroupsTable />;
}
