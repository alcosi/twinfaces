"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinContext } from "@/features/twin";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinAttachmentsTable, TwinsTable } from "@/widgets/tables";

import {
  TwinComments,
  TwinFields,
  TwinGeneral,
  TwinHistory,
  TwinLinks,
} from "./views";

export function TwinScreen() {
  const { twin, twinId } = useContext(TwinContext);
  const { setBreadcrumbs } = useBreadcrumbs();

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
      content: <TwinAttachmentsTable twinId={twinId} />,
    },
    {
      key: "history",
      label: "History",
      content: <TwinHistory />,
    },
  ];

  const tabs: Tab[] = [
    ...DEFAULT_TABS,
    ...(twin.subordinates?.map((tab) => ({
      key: tab.id,
      label: tab.name,
      content: (
        <TwinsTable baseTwinClassId={tab.id} targetHeadTwinId={twinId} />
      ),
    })) ?? []),
  ];

  useEffect(() => {
    setBreadcrumbs([
      { label: "Twins", href: `/${PlatformArea.core}/twins` },
      {
        label: twin?.name!,
        href: `/${PlatformArea.core}/twins/${twinId}`,
      },
    ]);
  }, [twinId, twin?.name]);

  return <TabsLayout tabs={tabs} />;
}
