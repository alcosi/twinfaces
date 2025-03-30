"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinContext, TwinContextProvider } from "@/features/twin";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinsTable } from "@/widgets/tables";

import {
  TwinComments,
  TwinFields,
  TwinGeneral,
  TwinHistory,
  TwinLinks,
} from "./views";

type Props = {
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

export function TwinScreen(props: Props) {
  return (
    <TwinContextProvider twinId={props.twinId}>
      <TwinScreenContent {...props} />
    </TwinContextProvider>
  );
}

function TwinScreenContent({ twinId }: Props) {
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
