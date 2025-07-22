"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Twin_DETAILED } from "@/entities/twin/server";
import { TwinContext } from "@/features/twin";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinsTable } from "@/widgets/tables";

import {
  TwinAttachments,
  TwinComments,
  TwinFields,
  TwinGeneral,
  TwinHistory,
  TwinLinks,
} from "./views";

const DEFAULT_TABS = [
  {
    key: "general",
    label: "General",
    content: <TwinGeneral />,
  },
  {
    key: "fields",
    label: "Fields",
    content: <TwinFields />,
  },
  {
    key: "relations",
    label: "Relations",
    content: <TwinLinks />,
  },
  {
    key: "comments",
    label: "Comments",
    content: <TwinComments />,
  },
  {
    key: "attachments",
    label: "Attachments",
    content: <TwinAttachments />,
  },
  {
    key: "history",
    label: "History",
    content: <TwinHistory />,
  },
];

export function TwinScreen() {
  const router = useRouter();
  const { twin, twinId } = useContext(TwinContext);

  function handleRowClick(row: Twin_DETAILED) {
    router.push(`/${PlatformArea.core}/twins/${row.id}`);
  }

  const tabs: Tab[] = [
    ...DEFAULT_TABS,
    ...(twin.subordinates?.map((tab) => ({
      key: tab.id,
      label: tab.name,
      content: (
        <TwinsTable
          baseTwinClassId={tab.id}
          targetHeadTwinId={twinId}
          onRowClick={handleRowClick}
        />
      ),
    })) ?? []),
  ];

  return <TabsLayout tabs={tabs} />;
}
