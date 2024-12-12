"use client";

import { TwinClassContext } from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect } from "react";
import { GeneralSection } from "./views/general-section";

export type PageProps = {
  params: {
    linkId: string;
  };
};

const tabs: Tab[] = [
  {
    key: "general",
    label: "General",
    content: <GeneralSection />,
  },
];

export function TwinClassLinkPage({ params: { linkId } }: PageProps) {
  const { twinClassId, twinClass, link } = useContext(TwinClassContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/workspace/twinclass" },
      { label: twinClass?.name!, href: `/workspace/twinclass/${twinClassId}` },
      { label: "Links", href: `/workspace/twinclass/${twinClassId}#links` },
      {
        label: link?.name ?? "N/A",
        href: `/workspace/twinclass/${twinClassId}/link/${linkId}`,
      },
    ]);
  }, [linkId, twinClassId, twinClass?.name, link?.name]);

  return <TabsLayout tabs={tabs} />;
}
