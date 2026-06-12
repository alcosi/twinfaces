import { Zap } from "lucide-react";

import { TwinTriggersScreen } from "@/screens/twin-triggers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Twin Triggers"
      description="Configure twin-level triggers."
      icon={Zap}
    >
      <TwinTriggersScreen />
    </TablePageLayout>
  );
}
