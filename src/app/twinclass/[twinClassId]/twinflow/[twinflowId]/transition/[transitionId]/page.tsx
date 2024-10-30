"use client";

import { useContext, useEffect, useState } from "react";
import { ApiContext } from "@/shared/api";
import { TwinFlow, TwinFlowTransition } from "@/entities/twinFlow";
import { toast } from "sonner";
import {
  ReturnOptions,
  Section,
  SideNavLayout,
} from "@/components/layout/side-nav-layout";
import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { LoadingOverlay } from "@/components/base/loading";
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
  const { findStatusById } = useContext(TwinClassContext);

  useEffect(() => {
    fetchTransitionData();
  }, []);

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

  const sections: Section[] = transition
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

  const returnOptions: ReturnOptions[] = [
    {
      path: `/twinclass/${twinClassId}/twinflow/${twinflowId}#transitions`,
      label: "Back to class",
    },
    {
      path: `/twinclass/${twinClassId}/#twinflow/`,
      label: "Back to twinflow",
    },
  ];

  return (
    <div>
      {loading && <LoadingOverlay />}
      {transition && (
        <SideNavLayout sections={sections} returnOptions={returnOptions}>
          <h1 className="text-xl font-bold">
            Transition {transition.name ?? transition.id}
          </h1>
        </SideNavLayout>
      )}
    </div>
  );
}
