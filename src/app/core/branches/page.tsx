import { FactoryBranchIcon } from "@/features/factory-branch/ui";
import { FactoryBranchesScreen } from "@/screens/factory-branches";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Factory Branches"
      description="Configure conditional factory branches."
      icon={FactoryBranchIcon}
    >
      <FactoryBranchesScreen />
    </TablePageLayout>
  );
}
