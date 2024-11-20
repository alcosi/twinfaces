"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { TwinStatusGeneral } from "@/app/twinclass/[twinClassId]/twinStatus/[twinStatusId]/twin-status-general";
import { LoadingOverlay } from "@/components/base/loading";
import { TwinStatus } from "@/entities/twinStatus";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinStatusPageProps {
  params: {
    twinStatusId: string;
  };
}

export default function TwinClassPage({
  params: { twinStatusId },
}: TwinStatusPageProps) {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
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
      { label: "Classes", href: "/twinclass" },
      {
        label: twinClass.name ?? "N/A",
        href: `/twinclass/${twinClass?.id}`,
      },
      {
        label: "Statuses",
        href: `/twinclass/${twinClass?.id}#statuses`,
      },
      {
        label: twinStatus?.name ?? "N/A",
        href: `/twinclass/${twinClass?.id}/twinStatus/${twinStatusId}`,
      },
    ]);
  }, [twinClass.id, twinClass.name, twinStatus?.name, twinStatusId]);

  function fetchTwinClassData() {
    if (twinStatusId) {
      setLoading(true);

      api.twinStatus
        .getById({ twinStatusId })
        .then((response) => {
          const data = response.data;
          if (!data || data.status != 0) {
            console.error("failed to fetch twin class", data);
            let message = "Failed to load twin class";
            if (data?.msg) message += `: ${data.msg}`;
            toast.error(message);
            return;
          }
          setTwinStatus(data.twinStatus);
        })
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
