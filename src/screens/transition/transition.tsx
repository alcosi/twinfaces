"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { TwinClassContext } from "@/entities/twin-class";
import {
  TwinFlowTransition_DETAILED,
  useFetchTwinFlowTransitionById,
} from "@/entities/twin-flow-transition";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowContext } from "@/features/twinFlow";
import { PlatformArea } from "@/shared/config";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinflowTransitionValidatorRules } from "../transitionValidators";
import { TwinflowTransitionTriggers } from "../twinclassTriggers";
import { TwinflowTransitionGeneral } from "./views";

export type TransitionScreenParams = {
  twinClassId: string;
  twinflowId: string;
  transitionId: string;
};

export function TransitionScreen({
  twinClassId,
  twinflowId,
  transitionId,
}: TransitionScreenParams) {
  const { twinClass } = useContext(TwinClassContext);
  const { twinFlow } = useContext(TwinFlowContext);
  const [transition, setTransition] = useState<
    TwinFlowTransition_DETAILED | undefined
  >(undefined);
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
      toast.error("Failed to fetch transition data");
    }
  }

  const tabs: Tab[] = transition
    ? [
        {
          key: "general",
          label: "General",
          content: <TwinflowTransitionGeneral transition={transition} />,
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

  if (loading || isUndefined(transition)) return <LoadingOverlay />;

  return <TabsLayout tabs={tabs} />;
}
