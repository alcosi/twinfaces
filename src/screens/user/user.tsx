"use client";

import { useContext } from "react";

import { UserContext } from "@/features/user";
import { Tab, TabsLayout } from "@/widgets/layout";
import { BusinessAccountUsersTable } from "@/widgets/tables";

import { UserGeneral, UserPermissions } from "./view";

export function UserScreen() {
  const { userId } = useContext(UserContext);

  const tabs: Tab[] = [
    {
      key: "genera",
      label: "General",
      content: <UserGeneral />,
    },
    {
      key: "permissions",
      label: "Permissions",
      content: <UserPermissions />,
    },
    {
      key: "businessAccounts",
      label: "Business accounts",
      content: <BusinessAccountUsersTable userId={userId} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
