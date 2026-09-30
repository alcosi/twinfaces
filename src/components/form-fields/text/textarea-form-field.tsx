import { FieldValues } from "react-hook-form";

import { FormField, TextareaProps } from "@/shared/ui";

import { RequiredFieldsGate } from "../required-mode";
import { FormFieldProps, TextFormFieldProps } from "../types";
import { TextAreaFormItem } from "./textarea-form-item";

export function TextAreaFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  label,
  description,
  required,
}: FormFieldProps<T> & TextFormFieldProps & TextareaProps) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  return (
    <RequiredFieldsGate required={required}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <TextAreaFormItem
            fieldValue={field.value}
            onChange={(x) => field.onChange(x)}
            inputId={inputId}
            label={label}
            description={description}
            required={required}
            inForm={true}
          />
        )}
      />
    </RequiredFieldsGate>
  );
}
