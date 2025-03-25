import { Control } from "react-hook-form";

import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import { TwinFlowTransitionFormValues } from "@/entities/twin-flow-transition";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";

export function TwinFlowTransitionFormFields({
  twinClassId,
  control,
}: {
  twinClassId: string;
  control: Control<TwinFlowTransitionFormValues>;
}) {
  const twinStatusAdapter = useTwinStatusSelectAdapter(twinClassId);

  return (
    <>
      <TextFormField control={control} name="alias" label="Alias" />

      <TextFormField control={control} name="name" label="Name" />

      <TextFormField control={control} name="description" label="Description" />

      <ComboboxFormField
        control={control}
        name="srcTwinStatusId"
        label="Source status"
        selectPlaceholder="Select source status"
        searchPlaceholder="Search source status..."
        noItemsText="No source status found"
        {...twinStatusAdapter}
      />

      <ComboboxFormField
        control={control}
        name="dstTwinStatusId"
        label="Destination status"
        selectPlaceholder="Select destination status"
        searchPlaceholder="Search destination status..."
        noItemsText="No destination status found"
        {...twinStatusAdapter}
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
