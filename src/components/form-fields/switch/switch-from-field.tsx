import { ComponentProps } from "react";
import { FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui";
import { Switch } from "@/shared/ui/switch";

import { RequiredFieldsGate } from "../required-mode";
import { FormFieldProps } from "../types";
import { SwitchFormItem } from "./switch-from-item";

export function SwitchFormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  ...props
}: FormFieldProps<T> &
  Omit<
    ComponentProps<typeof Switch>,
    "checked" | "onCheckedChange" | "onChange"
  >) {
  return (
    <RequiredFieldsGate required={props.required}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <SwitchFormItem
            fieldValue={field.value}
            onChange={field.onChange}
            label={label}
            description={description}
            inForm={true}
            {...props}
          />
        )}
      />
    </RequiredFieldsGate>
  );
}
