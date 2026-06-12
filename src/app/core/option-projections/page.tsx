import { ArrowRight } from "lucide-react";

import { OptionProjectionsScreen } from "@/screens/option-projections";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Option Projections"
      description="Map data list option projections."
      icon={ArrowRight}
    >
      <OptionProjectionsScreen />
    </TablePageLayout>
  );
}
