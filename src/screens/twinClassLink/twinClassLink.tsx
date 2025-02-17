"use client";

import { TwinClassContext } from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
import { GeneralSection } from "./views/general-section";
import { toast } from "sonner";
import { LoadingOverlay } from "@/shared/ui";
import { isUndefined } from "@/shared/libs";
import { TwinClassLink, useLinkFetchById } from "@/entities/twin-class-link";

export type PageProps = {
  params: {
    linkId: string;
  };
};

export function TwinClassLinkPage({ params: { linkId } }: PageProps) {
  const { twinClassId, twinClass } = useContext(TwinClassContext);
  const { setBreadcrumbs } = useBreadcrumbs();
  const [link, setLink] = useState<TwinClassLink | undefined>(undefined);
  const { fetchLinkById, loading } = useLinkFetchById();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/workspace/twinclass" },
      { label: twinClass?.name!, href: `/workspace/twinclass/${twinClassId}` },
      { label: "Relations", href: `/workspace/twinclass/${twinClassId}#links` },
      {
        label: link?.name ?? "N/A",
        href: `/workspace/twinclass/${twinClassId}/link/${linkId}`,
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
