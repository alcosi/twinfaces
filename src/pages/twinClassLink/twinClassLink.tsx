"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
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
  const { twinClassId } = useContext(TwinClassContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Twin Classes", href: "/twinclass" },
      { label: "Twin Class", href: `/twinclass/${twinClassId}#links` },
      { label: "Link", href: `/twinclass/${twinClassId}/link/${linkId}` },
    ]);
  }, [linkId, twinClassId]);

  return <TabsLayout tabs={tabs} />;
}
