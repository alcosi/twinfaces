"use client";

import { TwinflowGeneral } from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-general";
import { TwinflowTransitions } from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-transitions";
import { LoadingOverlay } from "@/components/base/loading";
import { ApiContext } from "@/lib/api/api";
import { TwinFlow } from "@/lib/api/api-types";
import { ReturnOptions, Section, SideNavLayout } from "@/widgets/layouts";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinflowPageProps {
  params: {
    twinflowId: string;
  };
}

export default function TwinflowPage({
  params: { twinflowId },
}: TwinflowPageProps) {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twinflow, setTwinflow] = useState<TwinFlow | undefined>(undefined);

  useEffect(() => {
    fetchTwinflowData();
  }, []);

  function fetchTwinflowData() {
    setLoading(true);
    api.twinflow
      .getById({
        twinFlowId: twinflowId,
      })
      .then((response) => {
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
      .catch((e) => {
        console.error("exception while fetching twin class", e);
        toast.error("Failed to fetch twin class");
      })
      .finally(() => setLoading(false));
  }

  const sections: Section[] = twinflow
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

  const returnOptions: ReturnOptions[] = twinflow
    ? [
        {
          path: `/twinclass/${twinflow.twinClassId}#twinflows`,
          label: "Back",
        },
      ]
    : [];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {twinflow && (
        <SideNavLayout sections={sections} returnOptions={returnOptions}>
          <h1 className="text-xl font-bold">{twinflow.name}</h1>
        </SideNavLayout>
      )}
    </div>
  );
}
