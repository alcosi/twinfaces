import { Building2 } from "lucide-react";

import { BusinessAccountsScreen } from "@/screens/business-accounts";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Business Accounts"
      description="Manage business account entities."
      icon={Building2}
    >
      <BusinessAccountsScreen />
    </TablePageLayout>
  );
}
