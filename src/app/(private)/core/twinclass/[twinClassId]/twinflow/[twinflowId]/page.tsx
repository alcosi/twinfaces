"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinFlow, useTwinFlowFetchByIdV1 } from "@/entities/twin-flow";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinFlowTransitionsTable } from "@/widgets/tables";

import { TwinflowGeneral } from "./twinflow-general";

type TwinflowPageProps = {
  params: {
    twinflowId: string;
  };
};

export default function TwinflowPage({
  params: { twinflowId },
}: TwinflowPageProps) {
  const [twinflow, setTwinflow] = useState<TwinFlow | undefined>(undefined);
  const { fetchTwinFlowById, loading } = useTwinFlowFetchByIdV1();

  useEffect(() => {
    fetchTwinflowData();
  }, []);

  async function fetchTwinflowData() {
    try {
      const response = await fetchTwinFlowById(twinflowId);
      setTwinflow(response);
    } catch {
      toast.error("Failed to fetch twin flow");
    }
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
          content: <TwinFlowTransitionsTable twinflow={twinflow} />,
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
