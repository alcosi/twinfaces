"use client";

import { LoadingOverlay } from "@/components/base/loading";
import { TwinFlowTransition } from "@/entities/twinFlow";
import { useBreadcrumbs } from "@/features/breadcrumb";
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
      { label: "Twin Classes", href: "/twinclass" },
      { label: "Twin Class", href: `/twinclass/${twinClassId}#twinflows` },
      {
        label: "Twin Flow",
        href: `/twinclass/${twinClassId}/twinflow/${twinflowId}`,
      },
      {
        label: "Transition",
        href: `/twinclass/${twinClassId}/twinflow/${twinflowId}/transition/${transitionId}`,
      },
    ]);
  }, [twinClassId, twinflowId, transitionId]);

  function fetchTransitionData() {
    setLoading(true);
    api.twinflow
      .getTransitionById({
        transitionId,
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
        setTransition(data.transition);
      })
      .catch((e) => {
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
