import { Control, FieldValues, Path } from "react-hook-form";
import { TextFormField } from "@/components/form-fields/text-form-field";
import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";

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
