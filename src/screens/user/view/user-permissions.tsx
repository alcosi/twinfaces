import { useContext } from "react";

import { UserContext } from "@/features/user";
import { PermissionGroupsTable } from "@/widgets/tables";

export function UserPermissions() {
  const { userId } = useContext(UserContext);

  return (
    <div className="space-y-16 pb-8">
      <PermissionGroupsTable userId={userId} title="Permission Groups" />
    </div>
  );
}
