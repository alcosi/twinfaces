import { GitMerge } from "lucide-react";

import { TransitionTriggersScreen } from "@/screens/transition-triggers/transition-triggers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Transition Triggers"
      description="Define transition trigger events."
      icon={GitMerge}
    >
      <TransitionTriggersScreen />
    </TablePageLayout>
  );
}
