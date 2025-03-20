"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PermissionContext } from "@/features/permission";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { Tab, TabsLayout } from "@/widgets/layout";

import { GeneralSection, GrantSection } from "./views";

export type PageProps = {
  params: {
    permissionId: string;
  };
};

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <GeneralSection />,
  },
  {
    key: "grant",
    label: "Grant",
    content: <GrantSection />,
  },
];

export function PermissionPage({ params: { permissionId } }: PageProps) {
  const { permission } = useContext(PermissionContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Permissions", href: `/${PlatformArea.core}/permissions` },
      {
        label: isPopulatedString(permission?.name)
          ? permission?.name
          : permission?.key!,
        href: `/${PlatformArea.core}/permissions/${permissionId}`,
      },
    ]);
  }, [permissionId, permission?.name, permission?.key]);

  return <TabsLayout tabs={tabs} />;
}
