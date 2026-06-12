import { Zap } from "lucide-react";

import { StatusTriggersScreen } from "@/screens/status-triggers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Status Triggers"
      description="Configure status transition triggers."
      icon={Zap}
    >
      <StatusTriggersScreen />
    </TablePageLayout>
  );
}
