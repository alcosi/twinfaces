"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinClassContext } from "@/entities/twin-class";
import {
  TwinFlowTransition,
  useFetchTwinFlowTransitionById,
} from "@/entities/twin-flow-transition";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowContext } from "@/features/twinFlow";
import { TwinflowTransitionValidatorRules } from "@/screens/transitionValidators";
import { TwinflowTransitionTriggers } from "@/screens/twinclassTriggers";
import { PrivateApiContext } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinflowTransitionGeneral } from "./twinflow-transition-general";

interface TransitionPageProps {
  params: {
    twinClassId: string;
    twinflowId: string;
    transitionId: string;
  };
}

export default function TransitionPage({
  params: { twinClassId, twinflowId, transitionId },
}: TransitionPageProps) {
  const api = useContext(PrivateApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const { twinFlow } = useContext(TwinFlowContext);
  const [transition, setTransition] = useState<TwinFlowTransition | undefined>(
    undefined
  );
  const { setBreadcrumbs } = useBreadcrumbs();
  const { fetchTwinFlowTransitionById, loading } =
    useFetchTwinFlowTransitionById();

  useEffect(() => {
    fetchTransitionData();
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
        label: twinFlow?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinflow/${twinflowId}`,
      },
      {
        label: "Transitions",
        href: `/${PlatformArea.core}/twinclass/${twinClassId}/twinflow/${twinflowId}#transitions`,
      },
      {
        label: transition?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClassId}/twinflow/${twinflowId}/transition/${transitionId}`,
      },
    ]);
  }, [
    twinClassId,
    twinClass?.name,
    twinflowId,
    transitionId,
    transition?.name,
  ]);

  async function fetchTransitionData() {
    try {
      const response = await fetchTwinFlowTransitionById(transitionId);
      setTransition(response);
    } catch {
      toast.error("Failed to fetch twin class");
    }
  }

  const tabs: Tab[] = transition
    ? [
        {
          key: "general",
          label: "General",
          content: (
            <TwinflowTransitionGeneral
              transition={transition}
              onChange={fetchTransitionData}
            />
          ),
        },
        {
          key: "triggers",
          label: "Triggers",
          content: <TwinflowTransitionTriggers transition={transition} />,
        },
        {
          key: "validators",
          label: "Validators",
          content: <TwinflowTransitionValidatorRules transition={transition} />,
        },
      ]
    : [];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {transition && <TabsLayout tabs={tabs} />}
    </div>
  );
}
