import { UserCheck } from "lucide-react";

import { RecipientsScreen } from "@/screens/recipients";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Recipients"
      description="Manage notification recipients."
      icon={UserCheck}
    >
      <RecipientsScreen />
    </TablePageLayout>
  );
}
