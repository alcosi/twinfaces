"use client";

import { TwinClassFieldV1_DETAILED } from "@/entities/twin-class-field";
import { ProjectionsTable } from "@/widgets/tables/projections";

export function TwinFieldProjections({
  twinField,
}: {
  twinFieldId: string;
  twinField: TwinClassFieldV1_DETAILED;
}) {
  return (
    <>
      <ProjectionsTable title="Incoming" twinFieldId={twinField.id} />
      <ProjectionsTable title="Outgoing" twinFieldId={twinField.id} />
    </>
  );
}
