"use client";

import { useContext } from "react";

import { BusinessAccountContext } from "@/features/business-account";
import { Tab, TabsLayout } from "@/widgets/layout";
import { BusinessAccountUsersTable, TwinsTable } from "@/widgets/tables";

import { BusinessAccountGeneral } from "./views";

export function BusinessAccountScreen() {
  const { businessAccount } = useContext(BusinessAccountContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <BusinessAccountGeneral />,
    },
    {
      key: "users",
      label: "Users",
      content: <BusinessAccountUsersTable />,
    },
    {
      key: "twins",
      label: "Twins",
      content: (
        <TwinsTable businessAccountId={businessAccount.businessAccountId} />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
