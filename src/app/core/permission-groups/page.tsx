import { PermissionGroupIcon } from "@/features/permission-group/ui";
import { PermissionGroupsScreen } from "@/screens/permission-groups";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Permission Groups"
      description="Organize permissions into groups."
      icon={PermissionGroupIcon}
    >
      <PermissionGroupsScreen />
    </TablePageLayout>
  );
}
