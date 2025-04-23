import { FieldPath, FieldValues } from "react-hook-form";

import { AutoFormCalendarValueInfo } from "@/components/auto-field";
import {
  FormFieldProps,
  FormItemLabel,
  TextFormField,
} from "@/components/form-fields";

export function CalendarFormField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormFieldProps<T> & AutoFormCalendarValueInfo) {
  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <div className="col-span-2">
          <FormItemLabel>{label}</FormItemLabel>
        </div>
      )}

      <TextFormField
        {...props}
        name={`${name}.from` as FieldPath<T>}
        control={control}
        type="date"
        className="cursor-pointer"
      />

      <TextFormField
        {...props}
        name={`${name}.to` as FieldPath<T>}
        control={control}
        type="date"
        className="cursor-pointer"
      />
    </div>
  );
}
