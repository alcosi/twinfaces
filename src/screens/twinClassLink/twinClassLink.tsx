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
      { label: "Classes", href: "/twinclass" },
      { label: twinClass?.name!, href: `/twinclass/${twinClassId}` },
      { label: "Links", href: `/twinclass/${twinClassId}#links` },
      {
        label: link?.name ?? "N/A",
        href: `/twinclass/${twinClassId}/link/${linkId}`,
      },
    ]);
  }, [linkId, twinClassId, twinClass?.name, link?.name]);

  return <TabsLayout tabs={tabs} />;
}
