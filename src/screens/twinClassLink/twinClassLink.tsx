"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { Link, useLinkFetchById } from "@/entities/link";
import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";
import { Tab, TabsLayout } from "@/widgets/layout";

import { GeneralSection } from "./views/general-section";

export type PageProps = {
  params: {
    linkId: string;
  };
};

export function TwinClassLinkPage({ params: { linkId } }: PageProps) {
  const { twinClassId, twinClass } = useContext(TwinClassContext);
  const { setBreadcrumbs } = useBreadcrumbs();
  const [link, setLink] = useState<Link | undefined>(undefined);
  const { fetchLinkById, loading } = useLinkFetchById();

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

  useEffect(() => {
    fetchLinkData();
  }, [linkId]);

  function fetchLinkData() {
    fetchLinkById({
      linkId,
      query: {
        lazyRelation: false,
        showLinkMode: "MANAGED",
        showLinkSrc2TwinClassMode: "DETAILED",
        showLinkDst2TwinClassMode: "DETAILED",
        showLink2UserMode: "DETAILED",
      },
    })
      .then((response) => {
        setLink(response);
      })
      .catch(() => {
        toast.error("Failed to fetch link");
      });
  }

  if (isUndefined(link)) return <>{loading && <LoadingOverlay />}</>;

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <GeneralSection link={link} onChange={fetchLinkData} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
