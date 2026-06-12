import { PermissionIcon } from "@/features/permission/ui";
import { PermissionsScreen } from "@/screens/permissions";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Permissions"
      description="Manage access permissions."
      icon={PermissionIcon}
    >
      <PermissionsScreen />
    </TablePageLayout>
  );
}
