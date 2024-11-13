"use client";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect } from "react";
import { TwinContext } from "./twin-context";
import { TwinFields, TwinGeneral, TwinLinks } from "./views";
import { TwinComments } from "@/app/twin/[twinId]/twin-comments";

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
    key: "links",
    label: "Links",
    content: <TwinLinks />,
  },
  {
    key: "comments",
    label: "Comments",
    content: <TwinComments />,
  },
];
export default function TwinPage() {
  const { twinId, twin } = useContext(TwinContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Twins", href: "/twin" },
      {
        label: twin?.name!,
        href: `/twin/${twinId}`,
      },
    ]);
  }, [twinId, twin?.name]);

  return <TabsLayout tabs={tabs} />;
}
