import { CheckboxProps } from "@radix-ui/react-checkbox";
import { FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui/form";

import { FormFieldProps } from "../types";
import { CheckboxFormItem } from "./checkbox-form-item";

export function CheckboxFormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  hasIndeterminate,
  ...props
}: FormFieldProps<T> & { hasIndeterminate?: boolean } & Omit<
    CheckboxProps,
    "checked" | "onCheckedChange" | "type" | "onChange"
  >) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <CheckboxFormItem
          fieldValue={field.value}
          onChange={(x) => field.onChange(x)}
          label={label}
          description={description}
          hasIndeterminate={hasIndeterminate}
          inForm={true}
          {...props}
        />
      )}
    />
  );
}
