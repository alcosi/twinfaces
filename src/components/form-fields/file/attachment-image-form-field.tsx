import { FieldValues } from "react-hook-form";

import { isTruthy } from "@/shared/libs";
import { FormField } from "@/shared/ui";

import { FormFieldProps, TextFormFieldProps } from "../types";
import { AttachmentImageFormItem } from "./attachment-image-form-item";

type AttachmentImageFormFieldProps<T extends FieldValues> = FormFieldProps<T> &
  TextFormFieldProps;

export function AttachmentImageFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: AttachmentImageFormFieldProps<T>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        return (
          <AttachmentImageFormItem
            fieldValue={field.value}
            onChange={field.onChange}
            invalid={
              isTruthy(fieldState.error) || isTruthy(formState.errors.root)
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
