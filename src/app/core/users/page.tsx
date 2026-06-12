import { User } from "lucide-react";

import { UsersScreen } from "@/screens/users";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Users"
      description="Manage system users."
      icon={User}
    >
      <UsersScreen />
    </TablePageLayout>
  );
}
