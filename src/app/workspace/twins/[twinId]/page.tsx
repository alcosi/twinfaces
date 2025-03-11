"use client";

import { useContext, useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinContext } from "@/features/twin";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinsTable } from "@/widgets/tables";

import {
  TwinComments,
  TwinFields,
  TwinGeneral,
  TwinHistory,
  TwinLinks,
} from "./views";

export default function TwinPage() {
  const { twinId, twin } = useContext(TwinContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  const tabs: Tab[] = [
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
    ...(twin.subordinates?.map((tab) => ({
      key: tab.id,
      label: tab.name,
      content: <TwinsTable baseTwinClassId={tab.id} />,
    })) ?? []),
  ];

  useEffect(() => {
    setBreadcrumbs([
      { label: "Twins", href: "/workspace/twins" },
      {
        label: twin?.name!,
        href: `/workspace/twins/${twinId}`,
      },
    ]);
  }, [twinId, twin?.name]);

  return <TabsLayout tabs={tabs} />;
}
