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
      <TextFormField
        control={control}
        name="id"
        label="Permission ID"
        disabled
      />
      <TextFormField control={control} name="key" label="Permission Key" />
      <TextFormField control={control} name="name" label="Permission Name" />
      <TextFormField control={control} name="description" label="Description" />
    </>
  );
}
