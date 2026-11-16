import { useId } from "react";
import { FieldValues } from "react-hook-form";

import { isTruthy } from "@/shared/libs";
import { FormField } from "@/shared/ui";

import { RequiredFieldsGate } from "../required-mode";
import { FormFieldProps } from "../types";
import { FileFormItem } from "./file-form-item";

export function FileFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: FormFieldProps<T> & { accept?: string }) {
  // The hidden input is only reachable through its label, so an id is
  // mandatory here — generate one when no idPrefix was given.
  const generatedId = useId();
  const inputId = idPrefix ? `${idPrefix}-${name}` : `${generatedId}-${name}`;

  return (
    <RequiredFieldsGate required={props.required}>
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState, formState }) => {
          return (
            <FileFormItem
              fieldValue={field.value}
              onChange={(x) => field.onChange(x)}
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
    </RequiredFieldsGate>
  );
}
