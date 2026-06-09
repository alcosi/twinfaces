"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Twin_DETAILED } from "@/entities/twin/server";
import { BusinessAccountContext } from "@/features/business-account";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { BusinessAccountUsersTable, TwinsTable } from "@/widgets/tables";

import { BusinessAccountGeneral } from "./views";

export function BusinessAccountScreen() {
  const { businessAccount } = useContext(BusinessAccountContext);
  const router = useRouter();

  function handleRowClick(row: Twin_DETAILED) {
    router.push(`/${PlatformArea.core}/twins/${row.id}`);
  }

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
        <TwinsTable
          businessAccountId={businessAccount.businessAccountId}
          onRowClick={handleRowClick}
        />
      ),
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
