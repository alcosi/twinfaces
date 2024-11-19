import { TextFormField } from "@/components/form-fields/text-form-field";
import { TwinFlowTransitionFormValues } from "@/entities/twinFlowTransition";
import { Control } from "react-hook-form";

export function TwinFlowTransitionFormFields({
  control,
}: {
  control: Control<TwinFlowTransitionFormValues>;
}) {
  return (
    <>
      <TextFormField control={control} name="alias" label="Alias" />
      <TextFormField control={control} name="name" label="Name" />
      <TextFormField control={control} name="description" label="Description" />
      {/* TODO: Replace with <StatusSelectField /> as per https://alcosi.atlassian.net/browse/TWINFACES-117 */}
      <TextFormField
        control={control}
        name="srcTwinStatusId"
        label="Source Status ID"
      />
      {/* TODO: Replace with <StatusSelectField /> as per https://alcosi.atlassian.net/browse/TWINFACES-117 */}
      <TextFormField
        control={control}
        name="dstTwinStatusId"
        label="Destination Status ID"
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
