"use client";

import { useContext } from "react";

import { ValidatorSetContext } from "@/features/validator-set";
import { Tab, TabsLayout } from "@/widgets/layout";
import { TwinValidatorsTable } from "@/widgets/tables";

import { ValidatorSetGeneral } from "./views";

export function ValidatorSetScreen() {
  const { validatorSet } = useContext(ValidatorSetContext);

  const tabs: Tab[] = [
    {
      key: "general",
      label: "General",
      content: <ValidatorSetGeneral />,
    },
    {
      key: "validators",
      label: "Validators",
      // Scoped to this set, so the table drops its validator-set column,
      // filter and chart breakdown — they would all be constant here.
      content: <TwinValidatorsTable twinValidatorSetId={validatorSet.id} />,
    },
  ];

  return <TabsLayout tabs={tabs} />;
}
