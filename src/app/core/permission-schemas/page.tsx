"use client";

import { PermissionSchemaIcon } from "@/features/permission-schema/ui";
import { PermissionSchemasScreen } from "@/screens/permission-schemas";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function PermissionSchemasPage() {
  return (
    <TablePageLayout
      title="Permission Schemas"
      description="Define permission schema policies."
      icon={PermissionSchemaIcon}
    >
      <PermissionSchemasScreen />
    </TablePageLayout>
  );
}
