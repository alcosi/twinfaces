import { Control } from "react-hook-form";

import { TextFormField } from "@/components/form-fields";

import { PermissionFormValues } from "@/entities/permission";
import { PermissionGroupSelectField } from "@/features/permissionGroup";

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
      <TextFormField
        control={control}
        name="key"
        label="Key"
        autoFocus={true}
      />
      <TextFormField control={control} name="name" label="Name" />
      <TextFormField control={control} name="description" label="Description" />
    </>
  );
}
