"use client";

import { useContext } from "react";

import { TwinStatusContext } from "@/features/twin-status";
import {
  FactoryPipelinesTable,
  TwinFlowTransitionsTable,
} from "@/widgets/tables";

export function TwinStatusTransitions() {
  const { twinStatusId } = useContext(TwinStatusContext);

  return (
    <>
      <TwinFlowTransitionsTable twinStatusId={twinStatusId} title="Incoming" />

      <TwinFlowTransitionsTable twinStatusId={twinStatusId} title="Outgoing" />

      <FactoryPipelinesTable
        outputTwinStatusId={twinStatusId}
        title="Pipelines"
      />
    </>
  );
}
