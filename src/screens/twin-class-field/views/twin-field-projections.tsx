"use client";

import { TwinClassFieldV1_DETAILED } from "@/entities/twin-class-field";
import { ProjectionsTable } from "@/widgets/tables/projections";

export function TwinFieldProjections({
  twinFieldId,
  twinField,
}: {
  twinFieldId: string;
  twinField: TwinClassFieldV1_DETAILED;
}) {
  console.log(twinFieldId, twinField.twinClassId);
  return (
    <>
      <ProjectionsTable title="Incoming" twinClassId={twinField.id} />
      <ProjectionsTable title="Outgoing" twinClassId={twinField.twinClassId} />
    </>
  );
}
