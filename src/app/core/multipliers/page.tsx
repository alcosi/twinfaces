import { Layers } from "lucide-react";

import { FactoryMultipliersScreen } from "@/screens/factory-multipliers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Factory Multipliers"
      description="Manage factory multiplier configurations."
      icon={Layers}
    >
      <FactoryMultipliersScreen />
    </TablePageLayout>
  );
}
