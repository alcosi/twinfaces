"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect } from "react";
import { TwinContext } from "./twin-context";
import {
  TwinFields,
  TwinGeneral,
  TwinLinks,
  TwinComments,
  TwinHistory,
} from "./views";

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
];
export default function TwinPage() {
  const { twinId, twin } = useContext(TwinContext);
  const { setBreadcrumbs } = useBreadcrumbs();

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
