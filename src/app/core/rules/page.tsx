import { BookOpen } from "lucide-react";

import { RulesScreen } from "@/screens/rules/rules";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Rules"
      description="Define business rules."
      icon={BookOpen}
    >
      <RulesScreen />
    </TablePageLayout>
  );
}
