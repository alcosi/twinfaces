import { FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui";

import { RequiredFieldsGate } from "../required-mode";
import { FormFieldProps } from "../types";
import { ColorPickerFormItem } from "./color-picker-form-item";

export function ColorPickerFormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
}: FormFieldProps<T>) {
  return (
    <RequiredFieldsGate required={required}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <ColorPickerFormItem
            label={label}
            description={description}
            required={required}
            fieldValue={field.value}
            onChange={field.onChange}
            inForm={true}
          />
        )}
      />
    </RequiredFieldsGate>
  );
}
