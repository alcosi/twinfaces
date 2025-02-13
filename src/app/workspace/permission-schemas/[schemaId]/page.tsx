"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect } from "react";
import { PermissionSchemaContext } from "@/features/permission-schema";
import { PermissionSchemaGeneral } from "@/screens/permission-schema";

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <PermissionSchemaGeneral />,
  },
];
export default function PermissionSchemasPage() {
  const { schema, schemaId } = useContext(PermissionSchemaContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Schemas", href: "/workspace/permission-schemas" },
      {
        label: schema?.name!,
        href: `/workspace/permission-schemas/${schemaId}`,
      },
    ]);
  }, [schemaId, schema?.name, setBreadcrumbs]);

  return <TabsLayout tabs={tabs} />;
}
