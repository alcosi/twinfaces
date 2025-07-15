import { FieldValues } from "react-hook-form";

import { isTruthy } from "@/shared/libs";
import { FormField, InputProps } from "@/shared/ui";

import { FormFieldProps, TextFormFieldProps } from "../types";
import { TextFormItem } from "./text-form-item";

export function TextFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: FormFieldProps<T> & TextFormFieldProps & Omit<InputProps, "onChange">) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        return (
          <TextFormItem
            autoFocus={props.autoFocus}
            fieldValue={field.value}
            onChange={(x) => field.onChange(x)}
            invalid={
              isTruthy(formState.errors.root?.message) || fieldState.invalid
            }
            inputId={inputId}
            inForm={true}
            {...props}
          />
        );
      }}
    />
  );
}
