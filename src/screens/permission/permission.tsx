"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PermissionContext } from "@/features/permission";
import { isPopulatedString } from "@/shared/libs";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect } from "react";
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
      { label: "Permissions", href: "/permission" },
      {
        label: isPopulatedString(permission?.name)
          ? permission?.name
          : permission?.key!,
        href: `/permission/${permissionId}`,
      },
    ]);
  }, [permissionId, permission?.name, permission?.key]);

  return <TabsLayout tabs={tabs} />;
}
