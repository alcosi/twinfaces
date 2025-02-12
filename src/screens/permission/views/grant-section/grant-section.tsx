import { UserGroupsTable } from "./user-groups-table";
import { UsersTable } from "./users-table";
import { TwinRoleTable } from "./twin-role-table";
import { AssigneePropagationTable } from "./assignee-propagation-table";
import { SpaceRoleTable } from "./space-role-table";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/shared/ui";

export function GrantSection() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingOverlay />;

  return (
    <>
      <UsersTable />
      <UserGroupsTable />
      <TwinRoleTable />
      <SpaceRoleTable />
      <AssigneePropagationTable />
    </>
  );
}
