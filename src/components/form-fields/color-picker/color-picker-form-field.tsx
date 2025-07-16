import { FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui";

import { FormFieldProps } from "../types";
import { ColorPickerFormItem } from "./color-picker-form-item";

export function ColorPickerFormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <ColorPickerFormItem
          label={label}
          description={description}
          fieldValue={field.value}
          onChange={field.onChange}
          inForm={true}
        />
      )}
    />
  );
}
