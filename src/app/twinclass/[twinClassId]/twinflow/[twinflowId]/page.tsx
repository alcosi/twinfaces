"use client";

import { TwinflowGeneral } from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-general";
import { LoadingOverlay } from "@/components/base/loading";
import { TwinFlow, useTwinFlowFetchByIdV1 } from "@/entities/twinFlow";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowTransitions } from "@/screens/twinFlowTransitions";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TwinClassContext } from "../../twin-class-context";

interface TwinflowPageProps {
  params: {
    twinflowId: string;
  };
}

export default function TwinflowPage({
  params: { twinflowId },
}: TwinflowPageProps) {
  const { twinClass } = useContext(TwinClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twinflow, setTwinflow] = useState<TwinFlow | undefined>(undefined);
  const { fetchTwinFlowById } = useTwinFlowFetchByIdV1();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    fetchTwinflowData();
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: "/twinclass" },
      {
        label: twinClass?.name!,
        href: `/twinclass/${twinClass?.id}`,
      },
      {
        label: "Twinflows",
        href: `/twinclass/${twinClass?.id}#twinflows`,
      },
      {
        label: twinflow?.name ?? "N/A",
        href: `/twinclass/${twinClass?.id}/twinflow/${twinflowId}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, twinflowId, twinflow?.name]);

  function fetchTwinflowData() {
    setLoading(true);

    fetchTwinFlowById(twinflowId)
      .then(setTwinflow)
      .catch((e: any) => {
        console.error("exception while fetching twin class", e);
        toast.error("Failed to fetch twin class");
      })
      .finally(() => setLoading(false));
  }

  const tabs: Tab[] = twinflow
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <TwinflowGeneral twinflow={twinflow} onChange={fetchTwinflowData} />
          ),
        },
        {
          key: "transitions",
          label: "Transitions",
          content: (
            <TwinFlowTransitions
              twinClassId={twinClass?.id}
              twinFlowId={twinflowId}
            />
          ),
        },
      ]
    : [];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {twinflow && <TabsLayout tabs={tabs} />}
    </div>
  );
}
