import { TwinFlowIcon } from "@/features/twin-flow/ui";
import { TwinFlowsScreen } from "@/screens/twin-flows";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Twin Flows"
      description="Define workflow schemas."
      icon={TwinFlowIcon}
    >
      <TwinFlowsScreen />
    </TablePageLayout>
  );
}
