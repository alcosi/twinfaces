import { UserGroupsTable } from "./user-groups-table";
import { UsersTable } from "./users-table";
import { TwinRoleTable } from "./twin-role-table";
import { AssigneePropagationTable } from "./assignee-propagation-table";
import { SpaceRoleTable } from "./space-role-table";

export function GrantSection() {
  return (
    <>
      <UserGroupsTable />
      <UsersTable />
      <TwinRoleTable />
      <AssigneePropagationTable />
      <SpaceRoleTable />
    </>
  );
}
