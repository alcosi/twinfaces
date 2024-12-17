import { UserGroupsTable } from "./user-groups-table";
import { UsersTable } from "./users-table";
import { TwinRoleTable } from "./twin-role-table";

export function GrantSection() {
  return (
    <>
      <UserGroupsTable />
      <UsersTable />
      <TwinRoleTable />
    </>
  );
}
