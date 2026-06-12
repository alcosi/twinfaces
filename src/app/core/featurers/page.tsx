import { Layers } from "lucide-react";

import { FeaturersScreen } from "@/screens/featurers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function FeaturersPage() {
  return (
    <TablePageLayout
      title="Featurers"
      description="Manage field typers, triggers, validators, head hunters, and fillers."
      icon={Layers}
      variant="flow"
    >
      <FeaturersScreen />
    </TablePageLayout>
  );
}
