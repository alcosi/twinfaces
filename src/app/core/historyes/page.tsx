import { History } from "lucide-react";

import { HistoryesScreen } from "@/screens/historyes";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Histories"
      description="View historical records and changes."
      icon={History}
    >
      <HistoryesScreen />
    </TablePageLayout>
  );
}
