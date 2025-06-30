"use client";

import { useContext, useMemo } from "react";

import { TwinContext } from "@/features/twin";
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
  const { twin, twinId } = useContext(TwinContext);

  const tabs: Tab[] = useMemo(() => {
    return [
      ...DEFAULT_TABS,
      ...(twin.subordinates?.map((tab) => ({
        key: tab.id,
        label: tab.name,
        content: (
          <TwinsTable baseTwinClassId={tab.id} targetHeadTwinId={twinId} />
        ),
      })) ?? []),
    ];
  }, [twinId]);

  return <TabsLayout tabs={tabs} />;
}
