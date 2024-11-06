"use client";

import { TwinflowGeneral } from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-general";
import { TwinflowTransitions } from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-transitions";
import { LoadingOverlay } from "@/components/base/loading";
import { TwinFlow } from "@/entities/twinFlow";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
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
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twinflow, setTwinflow] = useState<TwinFlow | undefined>(undefined);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    fetchTwinflowData();
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Twin Classes", href: "/twinclass" },
      { label: "Twin Class", href: `/twinclass/${twinClass?.id}#twinflows` },
      {
        label: "Twin Flow",
        href: `/twinclass/${twinClass?.id}/twinflow/${twinflowId}`,
      },
    ]);
  }, [twinClass?.id, twinflowId]);

  function fetchTwinflowData() {
    setLoading(true);
    api.twinflow
      .getById({
        twinFlowId: twinflowId,
      })
      .then((response: any) => {
        const data = response.data;
        if (!data || data.status != 0) {
          console.error("failed to fetch twin class", data);
          let message = "Failed to load twin class";
          if (data?.msg) message += `: ${data.msg}`;
          toast.error(message);
          return;
        }
        setTwinflow(data.twinflow);
      })
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
            <TwinflowTransitions
              twinflow={twinflow}
              onChange={fetchTwinflowData}
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
