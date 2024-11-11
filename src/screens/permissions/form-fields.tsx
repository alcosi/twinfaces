import { TextFormField } from "@/components/form-fields/text-form-field";
import { PermissionFormValues } from "@/entities/permission";
import { Control } from "react-hook-form";

export function PermissionsFormFields({
  control,
}: {
  control: Control<PermissionFormValues>;
}) {
  return (
    <>
      {/* TODO: Replace with <PermissionGroupSelectField /> as per https://alcosi.atlassian.net/browse/TWINFACES-95 */}
      <TextFormField control={control} name="groupId" label="Grouop ID" />
      <TextFormField control={control} name="key" label="Permission Key" />
      <TextFormField control={control} name="name" label="Permission Name" />
      <TextFormField control={control} name="description" label="Description" />
    </>
  );
}
