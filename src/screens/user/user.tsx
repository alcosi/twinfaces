"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { UserContext } from "@/features/user";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { UserGeneral } from "./view";

const tabs: Tab[] = [
  {
    key: "genera",
    label: "General",
    content: <UserGeneral />,
  },
];

export function UserScreen() {
  const { userId, user } = useContext(UserContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Users",
        href: `/${PlatformArea.core}/users`,
      },
      {
        label: user.user?.fullName ?? "",
        href: `/${PlatformArea.core}/users/${userId}`,
      },
    ]);
  }, [userId, user.user?.fullName]);

  return <TabsLayout tabs={tabs} />;
}
