import { FieldValues } from "react-hook-form";

import { isTruthy } from "@/shared/libs";
import { FormField, InputProps } from "@/shared/ui";

import { FormFieldProps, TextFormFieldProps } from "../types";
import { TextFormItem } from "./text-form-item";

export function TextFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  customError,
  ...props
}: FormFieldProps<T> & TextFormFieldProps & Omit<InputProps, "onChange">) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <TextFormItem
            autoFocus={props.autoFocus}
            fieldValue={field.value}
            onChange={(x) => field.onChange(x)}
            hasError={isTruthy(fieldState.error || customError)}
            inputId={inputId}
            inForm={true}
            {...props}
          />
        );
      }}
    />
  );
}
