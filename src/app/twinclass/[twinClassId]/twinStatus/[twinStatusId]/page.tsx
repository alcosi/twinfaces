"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { TwinStatusGeneral } from "@/app/twinclass/[twinClassId]/twinStatus/[twinStatusId]/twin-status-general";
import { LoadingOverlay } from "@/components/base/loading";
import { useFetchTwinClassById } from "@/entities/twinClass";
import { TwinClassStatus } from "@/entities/twinClassStatus";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinStatusPageProps {
  params: {
    twinClassId: string;
    twinStatusId: string;
  };
}

export default function TwinClassPage({
  params: { twinClassId, twinStatusId },
}: TwinStatusPageProps) {
  const api = useContext(ApiContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  const { twinClass: twinClassCtx } = useContext(TwinClassContext);
  const [twinClass, setTwinClass] = useState(twinClassCtx);
  const { fetchTwinClassById } = useFetchTwinClassById();

  const [loading, setLoading] = useState<boolean>(false);
  const [twinStatus, setTwinStatus] = useState<TwinClassStatus | undefined>(
    undefined
  );

  useEffect(() => {
    fetchData();
  }, [twinStatusId, twinClassId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/twinclass" },
      { label: twinClass?.name!, href: `/twinclass/${twinClass?.id}#statuses` },
      {
        label: twinStatus?.name!,
        href: `/twinclass/${twinClassId}/twinStatus/${twinStatusId}`,
      },
    ]);
  }, [twinClass?.name, twinStatus?.name, twinClassId, twinStatusId]);

  function fetchData() {
    setLoading(true);
    const promises = [];

    if (twinStatusId) {
      promises.push(
        api.twinClass.getStatusById({ twinStatusId }).then((response) => {
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
      );
    }

    if (isUndefined(twinClassCtx)) {
      promises.push(fetchTwinClassById(twinClassId).then(setTwinClass));
    }

    Promise.all(promises)
      .catch((e) => {
        console.error("exception while fetching twin class", e);
        toast.error("Failed to fetch twin class");
      })
      .finally(() => setLoading(false));
  }

  const tabs: Tab[] = twinStatus
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <TwinStatusGeneral onChange={fetchData} status={twinStatus} />
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
