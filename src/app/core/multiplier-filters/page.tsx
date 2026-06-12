import { Filter } from "lucide-react";

import { FactoryMultiplierFiltersScreen } from "@/screens/factory-multiplier-filters";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Multiplier Filters"
      description="Configure multiplier filter rules."
      icon={Filter}
    >
      <FactoryMultiplierFiltersScreen />
    </TablePageLayout>
  );
}
