import { Factory } from "lucide-react";

import { TwinFlowFactoriesScreen } from "@/screens/twinflow-factories";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Twin Flow Factories"
      description="Manage factories for twin flows."
      icon={Factory}
    >
      <TwinFlowFactoriesScreen />
    </TablePageLayout>
  );
}
