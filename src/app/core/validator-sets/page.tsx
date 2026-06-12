import { CheckCircle } from "lucide-react";

import { ValidatorSetsScreen } from "@/screens/validator-sets";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Validator Sets"
      description="Configure data validation rules."
      icon={CheckCircle}
    >
      <ValidatorSetsScreen />
    </TablePageLayout>
  );
}
