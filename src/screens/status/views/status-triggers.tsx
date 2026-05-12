"use client";

import { useContext } from "react";

import { TwinStatusContext } from "@/features/twin-status";
import { StatusTriggersTable } from "@/widgets/tables";

export function TwinStatusTriggers() {
  const { twinStatusId } = useContext(TwinStatusContext);

  return (
    <>
      <StatusTriggersTable twinStatusId={twinStatusId} />
    </>
  );
}
