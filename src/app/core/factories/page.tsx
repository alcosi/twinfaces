import { Factory } from "lucide-react";

import { Factories } from "@/screens/factories";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function FactoriesPage() {
  return (
    <TablePageLayout
      title="Factories"
      description="Define and manage factories."
      icon={Factory}
    >
      <Factories />
    </TablePageLayout>
  );
}
