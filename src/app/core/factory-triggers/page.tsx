import { Zap } from "lucide-react";

import { FactoryTriggersScreen } from "@/screens/factory-triggers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Factory Triggers"
      description="Set up factory trigger events."
      icon={Zap}
    >
      <FactoryTriggersScreen />
    </TablePageLayout>
  );
}
