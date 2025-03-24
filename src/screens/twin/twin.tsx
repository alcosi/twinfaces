"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinContext, TwinContextProvider } from "@/features/twin";
import { PlatformArea } from "@/shared/config";
import { capitalize } from "@/shared/libs";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinsTable } from "@/widgets/tables";

import {
  TwinComments,
  TwinFields,
  TwinGeneral,
  TwinHistory,
  TwinLinks,
} from "./views";

export type TwinScreenParams = {
  pageKey: string;
  twinId: string;
};

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
    key: "history",
    label: "History",
    content: <TwinHistory />,
  },
];

export function TwinScreen(props: TwinScreenParams) {
  return (
    <TwinContextProvider twinId={props.twinId}>
      <TwinScreenContent {...props} />
    </TwinContextProvider>
  );
}

function TwinScreenContent({ pageKey, twinId }: TwinScreenParams) {
  const { twin } = useContext(TwinContext);
  const { setBreadcrumbs } = useBreadcrumbs();

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
    const area =
      pageKey === "twins" ? PlatformArea.core : PlatformArea.workspace;
    const listUrl = `/${area}/${pageKey}`;
    const detailUrl = `${listUrl}/${twinId}`;

    setBreadcrumbs([
      { label: capitalize(pageKey), href: listUrl },
      { label: twin?.name!, href: detailUrl },
    ]);
  }, [twinId, twin?.name]);

  return <TabsLayout tabs={tabs} />;
}
