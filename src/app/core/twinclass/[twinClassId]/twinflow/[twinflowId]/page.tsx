"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinClassContext } from "@/entities/twin-class";
import { TwinFlow, useTwinFlowFetchByIdV1 } from "@/entities/twin-flow";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
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
  const { twinClass } = useContext(TwinClassContext);
  const [twinflow, setTwinflow] = useState<TwinFlow | undefined>(undefined);
  const { fetchTwinFlowById, loading } = useTwinFlowFetchByIdV1();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    fetchTwinflowData();
  }, []);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes", href: `/${PlatformArea.core}/twinclass` },
      {
        label: twinClass?.name!,
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}`,
      },
      {
        label: "Twinflows",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}#twinflows`,
      },
      {
        label: twinflow?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinflow/${twinflowId}`,
      },
    ]);
  }, [twinClass?.id, twinClass?.name, twinflowId, twinflow?.name]);

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
