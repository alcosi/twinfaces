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
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinflowTransitionValidatorRules } from "../transitionValidators";
import { TwinflowTransitionTriggers } from "../twinclassTriggers";
import { TwinflowTransitionGeneral } from "./views";

type TransitionPageProps = {
  params: {
    twinClassId: string;
    twinflowId: string;
    transitionId: string;
  };
};

export function TransitionScreen({
  params: { twinClassId, twinflowId, transitionId },
}: TransitionPageProps) {
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
      { label: "Classes", href: "/workspace/twinclass" },
      {
        label: twinClass?.name!,
        href: `/workspace/twinclass/${twinClass?.id}`,
      },
      {
        label: "Twinflows",
        href: `/workspace/twinclass/${twinClass?.id}#twinflows`,
      },
      {
        label: twinFlow?.name ?? "N/A",
        href: `/workspace/twinclass/${twinClass?.id}/twinflow/${twinflowId}`,
      },
      {
        label: "Transitions",
        href: `/workspace/twinclass/${twinClassId}/twinflow/${twinflowId}#transitions`,
      },
      {
        label: transition?.name ?? "N/A",
        href: `/workspace/twinclass/${twinClassId}/twinflow/${twinflowId}/transition/${transitionId}`,
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
