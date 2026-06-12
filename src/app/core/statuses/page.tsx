"use client";

import { TwinStatusIcon } from "@/features/twin-status/ui";
import { TwinStatusesScreen } from "@/screens/statuses";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function StatusesPage() {
  return (
    <TablePageLayout
      title="Twin Class Statuses"
      description="Define status types for twins."
      icon={TwinStatusIcon}
    >
      <TwinStatusesScreen />
    </TablePageLayout>
  );
}
