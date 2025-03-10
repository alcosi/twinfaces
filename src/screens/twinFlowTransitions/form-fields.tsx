import { Control } from "react-hook-form";

import { TextFormField } from "@/components/form-fields";

import { TwinFlowTransitionFormValues } from "@/entities/twin-flow-transition";
import { TwinStatusSelectField } from "@/features/twinStatus";

export function TwinFlowTransitionFormFields({
  twinClassId,
  control,
}: {
  twinClassId: string;
  control: Control<TwinFlowTransitionFormValues>;
}) {
  return (
    <>
      <TextFormField control={control} name="alias" label="Alias" />
      <TextFormField
        control={control}
        name="name"
        label="Name"
        autoFocus={true}
      />
      <TextFormField control={control} name="description" label="Description" />
      <TwinStatusSelectField
        twinClassId={twinClassId}
        control={control}
        name="srcTwinStatusId"
        label="Source status"
        required={true}
      />
      <TwinStatusSelectField
        twinClassId={twinClassId}
        control={control}
        name="dstTwinStatusId"
        label="Destination status"
        required={true}
      />
      {/* TODO: Replace with <PermissionSelectField /> as per https://alcosi.atlassian.net/browse/TWINFACES-116 */}
      <TextFormField
        control={control}
        name="permissionId"
        label="Permission ID"
      />
    </>
  );
}
