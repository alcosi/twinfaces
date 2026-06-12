import { Trash2 } from "lucide-react";

import { FactoryErasers } from "@/screens/factory-erasers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function ErasersPage() {
  return (
    <TablePageLayout
      title="Factory Erasers"
      description="Manage factory eraser rules."
      icon={Trash2}
    >
      <FactoryErasers />
    </TablePageLayout>
  );
}
