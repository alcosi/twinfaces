import { FieldValues } from "react-hook-form";

import { FormField } from "@/shared/ui";

import { FormFieldProps } from "../types";
import { CalendarFormItem } from "./calendar-form-item";
import { CalendarFormFieldProps } from "./types";

export function CalendarFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: FormFieldProps<T> & CalendarFormFieldProps) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <CalendarFormItem
            fieldValue={field.value}
            onChange={field.onChange}
            inputId={inputId}
            inForm={true}
            {...props}
          />
        );
      }}
    />
  );
}
