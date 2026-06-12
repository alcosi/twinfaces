import { Filter } from "lucide-react";

import { FactoryConditionsScreen } from "@/screens/factory-conditions";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Factory Conditions"
      description="Set up factory conditions."
      icon={Filter}
    >
      <FactoryConditionsScreen />
    </TablePageLayout>
  );
}
