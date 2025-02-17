import { TextFormField } from "@/components/form-fields";
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
      <TextFormField control={control} name="key" label="Key" />
      <TextFormField control={control} name="name" label="Name" />
      <TextFormField control={control} name="description" label="Description" />
    </>
  );
}
