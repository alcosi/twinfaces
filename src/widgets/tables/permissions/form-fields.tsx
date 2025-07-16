import { Control } from "react-hook-form";

import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import { PermissionFormValues } from "@/entities/permission";
import { usePermissionGroupSelectAdapter } from "@/entities/permission-group";

export function PermissionsFormFields({
  control,
}: {
  control: Control<PermissionFormValues>;
}) {
  const permissionGroupAdapter = usePermissionGroupSelectAdapter();

  return (
    <>
      <ComboboxFormField
        control={control}
        name="groupId"
        label="Group"
        selectPlaceholder="Select permission group"
        searchPlaceholder="Search permission group..."
        noItemsText="No permission groups found"
        {...permissionGroupAdapter}
      />

      <TextFormField control={control} name="key" label="Key" />
      <TextFormField control={control} name="name" label="Name" />
      <TextFormField control={control} name="description" label="Description" />
    </>
  );
}
