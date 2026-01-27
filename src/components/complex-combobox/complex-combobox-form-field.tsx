import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui";

import { AutoFormComplexComboboxValueInfo } from "../auto-field";
import { ComplexComboboxFormItem } from "./complex-combobox-form-item";

export function ComplexComboboxFormField<TFormValues extends FieldValues>({
  name,
  control,
  info,
  required,
}: {
  name: FieldPath<TFormValues>;
  control: Control<TFormValues>;
  info: AutoFormComplexComboboxValueInfo;
  required?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <ComplexComboboxFormItem
          value={field.value}
          onChange={field.onChange}
          info={info}
          inForm
          required={required}
        />
      )}
    />
  );
}
