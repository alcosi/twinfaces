"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinClassContext } from "@/entities/twin-class";
import { TwinStatusV2, useFetchTwinStatusById } from "@/entities/twin-status";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinStatusGeneral } from "./twin-status-general";

interface TwinStatusPageProps {
  params: {
    twinStatusId: string;
  };
}

export default function TwinClassPage({
  params: { twinStatusId },
}: TwinStatusPageProps) {
  const { twinClass } = useContext(TwinClassContext);
  const { fetchTwinStatusById, loading } = useFetchTwinStatusById();
  const [twinStatus, setTwinStatus] = useState<TwinStatusV2 | undefined>(
    undefined
  );
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    fetchTwinStatusData();
  }, [twinStatusId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}`,
      },
      {
        label: "Statuses",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}#statuses`,
      },
      {
        label: twinStatus?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinStatus/${twinStatusId}`,
      },
    ]);
  }, [twinClass.id, twinClass.name, twinStatus?.name, twinStatusId]);

  async function fetchTwinStatusData() {
    if (twinStatusId) {
      await fetchTwinStatusById(twinStatusId)
        .then(setTwinStatus)
        .catch(() => {
          toast.error("Failed to fetch twin status");
        });
    }
  }

  const tabs: Tab[] = twinStatus
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <TwinStatusGeneral
              onChange={fetchTwinStatusData}
              status={twinStatus}
            />
          ),
        },
      ]
    : [];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {twinStatus && <TabsLayout tabs={tabs} />}
    </div>
  );
}
