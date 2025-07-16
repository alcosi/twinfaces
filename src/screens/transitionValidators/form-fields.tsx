import { Control, FieldValues, Path } from "react-hook-form";

import { CheckboxFormField, TextFormField } from "@/components/form-fields";

export function TransitionValidatorFormFields<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  return (
    <>
      <TextFormField
        control={control}
        name={"order" as Path<T>}
        label="Order"
        type="number"
      />

      <CheckboxFormField
        control={control}
        name={"active" as Path<T>}
        label="Active"
      />
    </>
  );
}
