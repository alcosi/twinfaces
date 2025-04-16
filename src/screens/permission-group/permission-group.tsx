"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PermissionGroupContext } from "@/features/permission-group";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { PermissionGroupGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PermissionGroupGeneral />,
  },
];

export function PermissionGroupScreen() {
  const { groupId, permissionGroup } = useContext(PermissionGroupContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Permission Groups",
        href: `/${PlatformArea.core}/permission-groups`,
      },
      {
        label: permissionGroup.name || "N/A",
        href: `/${PlatformArea.core}/permission-groups/${groupId}`,
      },
    ]);
  }, [setBreadcrumbs, groupId, permissionGroup]);

  return <TabsLayout tabs={tabs} />;
}
