"use client";

import { DatalistIcon } from "@/features/datalist/ui";
import { DatalistsScreen } from "@/screens/datalist";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function DatalistsPage() {
  return (
    <TablePageLayout
      title="Datalists"
      description="Manage data lookup lists."
      icon={DatalistIcon}
    >
      <DatalistsScreen />
    </TablePageLayout>
  );
}
