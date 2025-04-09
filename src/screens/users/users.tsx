"use client";

import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { UsersTable } from "@/widgets/tables/users";

export function UsersScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Users", href: `/${PlatformArea.core}/users` }]);
  }, [setBreadcrumbs]);

  return <UsersTable />;
}
