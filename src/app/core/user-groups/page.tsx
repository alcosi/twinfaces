"use client";

import { Users } from "lucide-react";

import { UserGroups } from "@/screens/user-groups";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function UserGroupsPage() {
  return (
    <TablePageLayout
      title="User Groups"
      description="Organize users into groups."
      icon={Users}
    >
      <UserGroups />
    </TablePageLayout>
  );
}
