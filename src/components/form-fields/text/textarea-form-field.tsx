import { FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui";
import { TextareaProps } from "@/shared/ui/textarea";

import { FormFieldProps, TextFormFieldProps } from "../types";
import { TextAreaFormItem } from "./textarea-form-item";

export function TextAreaFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  label,
  description,
}: FormFieldProps<T> & TextFormFieldProps & TextareaProps) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;
  return (
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
          inForm={true}
        />
      )}
    />
  );
}
