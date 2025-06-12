import { FieldValues } from "react-hook-form";

import { FormField, InputProps } from "@/shared/ui";

import { FormFieldProps, TextFormFieldProps } from "../types";
import { SecretTextFormItem } from "./secret-text-form-item";

type SecretTextFormFieldProps<T extends FieldValues> = FormFieldProps<T> &
  TextFormFieldProps &
  Omit<InputProps, "onChange">;

export function SecretTextFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: SecretTextFormFieldProps<T>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <SecretTextFormItem
          type="password"
          autoFocus={props.autoFocus}
          fieldValue={field.value}
          onChange={(x) => field.onChange(x)}
          inputId={inputId}
          inForm={true}
          {...props}
        />
      )}
    />
  );
}
