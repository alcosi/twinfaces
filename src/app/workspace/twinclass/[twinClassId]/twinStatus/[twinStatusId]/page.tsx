"use client";

import { TwinClassContext } from "@/entities/twin-class";
import { TwinStatus, useFetchTwinStatusById } from "@/entities/twin-status";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
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
  const { fetchTwinStatusById } = useFetchTwinStatusById();
  const [loading, setLoading] = useState<boolean>(false);
  const [twinStatus, setTwinStatus] = useState<TwinStatus | undefined>(
    undefined
  );
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    fetchTwinClassData();
  }, [twinStatusId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/workspace/twinclass" },
      {
        label: twinClass.name ?? "N/A",
        href: `/workspace/twinclass/${twinClass?.id}`,
      },
      {
        label: "Statuses",
        href: `/workspace/twinclass/${twinClass?.id}#statuses`,
      },
      {
        label: twinStatus?.name ?? "N/A",
        href: `/workspace/twinclass/${twinClass?.id}/twinStatus/${twinStatusId}`,
      },
    ]);
  }, [twinClass.id, twinClass.name, twinStatus?.name, twinStatusId]);

  function fetchTwinClassData() {
    if (twinStatusId) {
      setLoading(true);

      fetchTwinStatusById(twinStatusId)
        .then(setTwinStatus)
        .catch((e) => {
          console.error("exception while fetching twin class", e);
          toast.error("Failed to fetch twin class");
        })
        .finally(() => setLoading(false));
    }
  }

  const tabs: Tab[] = twinStatus
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <TwinStatusGeneral
              onChange={fetchTwinClassData}
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
