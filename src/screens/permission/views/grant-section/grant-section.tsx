import { UserGroupsTable } from "./user-groups-table";
import { UsersTable } from "./users-table";

export function GrantSection() {
  return (
    <>
      <UserGroupsTable />
      <UsersTable />
    </>
  );
}
