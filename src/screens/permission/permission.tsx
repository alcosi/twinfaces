"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets";
import { useEffect } from "react";
import { GeneralSection } from "./views/general-section";

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
];

export function PermissionPage({ params: { permissionId } }: PageProps) {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Permissions", href: "/permission" },
      {
        label: "Permission",
        href: `/permission/${permissionId}`,
      },
    ]);
  }, [permissionId]);

  return <TabsLayout tabs={tabs} />;
}
