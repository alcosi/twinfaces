"use client";

import { TwinClassContext } from "@/entities/twin-class";
import { TwinFlowTransition } from "@/entities/twinFlowTransition";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowContext } from "@/features/twinFlow";
import { ApiContext } from "@/shared/api";
import { LoadingOverlay } from "@/shared/ui/loading";
import { Tab, TabsLayout } from "@/widgets/layout";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TwinflowTransitionGeneral } from "./twinflow-transition-general";
import { TwinflowTransitionTriggers } from "@/screens/twinclassTriggers";
import { TwinflowTransitionValidatorRules } from "@/screens/transitionValidators";

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
  const [transition, setTransition] = useState<TwinFlowTransition | undefined>(
    undefined
  );
  const { setBreadcrumbs } = useBreadcrumbs();

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
