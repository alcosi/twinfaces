import { useEffect, useState } from "react";

import { LoadingOverlay } from "@/shared/ui";

import { AssigneePropagationTable } from "./assignee-propagation-table";
import { SpaceRoleTable } from "./space-role-table";
import { TwinRoleTable } from "./twin-role-table";
import { UserGroupsTable } from "./user-groups-table";
import { UsersTable } from "./users-table";

export function GrantSection() {
  // TODO: Remove this useEffect by resolving `https://alcosi.atlassian.net/browse/TWINFACES-467`
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
