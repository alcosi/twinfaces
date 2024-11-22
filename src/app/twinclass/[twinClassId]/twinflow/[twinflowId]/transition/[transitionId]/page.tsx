"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { LoadingOverlay } from "@/shared/ui/loading";
import { TF_Transition } from "@/entities/twinFlowTransition";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowContext } from "@/features/twinFlow";
import { ApiContext } from "@/shared/api";
import { Tab, TabsLayout } from "@/widgets";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TwinflowTransitionGeneral } from "./twinflow-transition-general";
import { TwinflowTransitionTriggers } from "./twinflow-transition-triggers";
import { TwinflowTransitionValidators } from "./twinflow-transition-validators";

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
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const { twinFlow } = useContext(TwinFlowContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [transition, setTransition] = useState<TF_Transition | undefined>(
    undefined
  );
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    fetchTransitionData();
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
        label: twinFlow?.name ?? "N/A",
        href: `/twinclass/${twinClass?.id}/twinflow/${twinflowId}`,
      },
      {
        label: "Transitions",
        href: `/twinclass/${twinClassId}/twinflow/${twinflowId}#transitions`,
      },
      {
        label: transition?.name ?? "N/A",
        href: `/twinclass/${twinClassId}/twinflow/${twinflowId}/transition/${transitionId}`,
      },
    ]);
  }, [
    twinClassId,
    twinClass?.name,
    twinflowId,
    transitionId,
    transition?.name,
  ]);

  function fetchTransitionData() {
    setLoading(true);
    api.twinFlowTransition
      .fetchById(transitionId)
      .then((response: any) => {
        const data = response.data;
        if (!data || data.status != 0) {
          console.error("failed to fetch twin class", data);
          let message = "Failed to load twin class";
          if (data?.msg) message += `: ${data.msg}`;
          toast.error(message);
          return;
        }
        setTransition(data.transition);
      })
      .catch((e: any) => {
        console.error("exception while fetching twin class", e);
        toast.error("Failed to fetch twin class");
      })
      .finally(() => setLoading(false));
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
          content: (
            <TwinflowTransitionTriggers
              transition={transition}
              onChange={fetchTransitionData}
            />
          ),
        },
        {
          key: "validators",
          label: "Validators",
          content: (
            <TwinflowTransitionValidators
              transition={transition}
              onChange={fetchTransitionData}
            />
          ),
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
