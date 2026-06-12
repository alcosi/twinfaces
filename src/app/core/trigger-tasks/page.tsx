import { CheckSquare } from "lucide-react";

import { TriggerTasksScreen } from "@/screens/trigger-tasks";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Trigger Tasks"
      description="Manage trigger task definitions."
      icon={CheckSquare}
    >
      <TriggerTasksScreen />
    </TablePageLayout>
  );
}
