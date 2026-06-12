import { FactoryConditionSetIcon } from "@/features/factory-condition-set/ui";
import { ConditionSetsScreen } from "@/screens/condition-sets";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function ConditionSetsPage() {
  return (
    <TablePageLayout
      title="Condition Sets"
      description="Define reusable condition sets for factories."
      icon={FactoryConditionSetIcon}
    >
      <ConditionSetsScreen />
    </TablePageLayout>
  );
}
