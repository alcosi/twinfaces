"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PermissionSchemaContext } from "@/features/permission-schema";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { PermissionSchemaGeneral } from "./views";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PermissionSchemaGeneral />,
  },
];

export function PermissionSchemaScreen() {
  const { schema, schemaId } = useContext(PermissionSchemaContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Schemas", href: `/${PlatformArea.core}/permission-schemas` },
      {
        label: schema?.name!,
        href: `/${PlatformArea.core}/permission-schemas/${schemaId}`,
      },
    ]);
  }, [schemaId, schema?.name, setBreadcrumbs]);

  return <TabsLayout tabs={tabs} />;
}
