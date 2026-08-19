import { SpellCheck } from "lucide-react";

import { TwinValidatorsScreen } from "@/screens/twin-validators";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Validators"
      description="A table with the list of validators from current domain."
      icon={SpellCheck}
    >
      <TwinValidatorsScreen />
    </TablePageLayout>
  );
}
