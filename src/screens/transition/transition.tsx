"use client";

import { useContext } from "react";

import { TwinFlowTransitionContext } from "@/features/twin-flow-transition";
import { Tab, TabsLayout } from "@/widgets/layout";

import { TwinflowTransitionValidatorRules } from "../transitionValidators";
import { TwinflowTransitionTriggers } from "../twinclassTriggers";
import { TwinflowTransitionGeneral } from "./views";

export function TransitionScreen() {
  const { transition } = useContext(TwinFlowTransitionContext);

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
