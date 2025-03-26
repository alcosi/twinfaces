"use client";

import { useContext, useEffect } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { LinkContext } from "@/features/link";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { GeneralSection } from "./views/general-section";

export function TwinClassLinkPage() {
  const { twinClassId, twinClass } = useContext(TwinClassContext);
  const { linkId, link } = useContext(LinkContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    //TODO add missed class name at breadCrumbs
    //https://alcosi.atlassian.net/browse/TWINFACES-469
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass?.name!,
        href: `/${PlatformArea.core}/twinclass/${twinClassId}`,
      },
      {
        label: "Relations",
        href: `/${PlatformArea.core}/twinclass/${twinClassId}#links`,
      },
      {
        label: link?.name ?? "N/A",
        href: `/${PlatformArea.core}/links/${linkId}`,
      },
    ]);
  }, [linkId, twinClassId, twinClass?.name, link?.name]);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <GeneralSection />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
