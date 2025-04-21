"use client";

import { useContext, useEffect } from "react";

import { TwinClassContext } from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { TwinFlowContext } from "@/features/twin-flow";
import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { PlatformArea } from "@/shared/config";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinflowTransitionValidatorRules } from "../transitionValidators";
import { TwinflowTransitionTriggers } from "../twinclassTriggers";
import { TwinflowTransitionGeneral } from "./views";

export function TransitionScreen() {
  const { twinClass, twinClassId } = useContext(TwinClassContext);
  const { transition, transitionId } = useContext(TwinFlowTransitionContext);
  const { twinFlow } = useContext(TwinFlowContext);
  const { setBreadcrumbs } = useBreadcrumbs();

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
        href: `/${PlatformArea.core}/twinclass/${twinClass?.id}/twinflow/${twinFlow?.id}`,
      },
      {
        label: "Transitions",
        href: `/${PlatformArea.core}/twinclass/${twinClassId}/twinflow/${twinFlow?.id}#transitions`,
      },
      {
        label: transition?.name ?? "N/A",
        href: `/${PlatformArea.core}/twinclass/${twinClassId}/twinflow/${twinFlow?.id}/transition/${transitionId}`,
      },
    ]);
  }, [
    twinClassId,
    twinClass?.name,
    twinFlow?.id,
    transitionId,
    transition?.name,
  ]);

  const tabs: Tab[] = transition
    ? [
        {
          key: "general",
          label: "General",
          content: <TwinflowTransitionGeneral />,
        },
        {
          key: "triggers",
          label: "Triggers",
          content: <TwinflowTransitionTriggers />,
        },
        {
          key: "validators",
          label: "Validators",
          content: <TwinflowTransitionValidatorRules />,
        },
      ]
    : [];

  return <TabsLayout tabs={tabs} />;
}
