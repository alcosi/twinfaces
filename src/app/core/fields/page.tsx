import { FieldIcon } from "@/features/twin-class-field/ui";
import { TwinClassFieldsScreen } from "@/screens/twin-class-fields";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function FieldsPage() {
  return (
    <TablePageLayout
      title="Twin Class Fields"
      description="Define fields for twin classes."
      icon={FieldIcon}
    >
      <TwinClassFieldsScreen />
    </TablePageLayout>
  );
}
