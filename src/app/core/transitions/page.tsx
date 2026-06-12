import { TwinFlowTransitionIcon } from "@/features/twin-flow-transition/ui";
import { TransitionsScreen } from "@/screens/twin-flow-transitions";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Twin Flow Transitions"
      description="Manage workflow transitions."
      icon={TwinFlowTransitionIcon}
    >
      <TransitionsScreen />
    </TablePageLayout>
  );
}
