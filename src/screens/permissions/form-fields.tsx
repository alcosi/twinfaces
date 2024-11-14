import { TextFormField } from "@/components/form-fields/text-form-field";
import { PermissionFormValues } from "@/entities/permission";
import { PermissionGroupSelectField } from "@/features/permissionGroup";
import { Control } from "react-hook-form";

export function PermissionsFormFields({
  control,
}: {
  control: Control<PermissionFormValues>;
}) {
  return (
    <>
      <PermissionGroupSelectField
        control={control}
        name="groupId"
        label="Group"
      />
      <TextFormField control={control} name="key" label="Permission Key" />
      <TextFormField control={control} name="name" label="Permission Name" />
      <TextFormField control={control} name="description" label="Description" />
    </>
  );
}
