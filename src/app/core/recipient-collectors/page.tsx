import { Users } from "lucide-react";

import { RecipientCollectorsScreen } from "@/screens/recipient-collectors";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Recipient Collectors"
      description="Collect notification recipients."
      icon={Users}
    >
      <RecipientCollectorsScreen />
    </TablePageLayout>
  );
}
