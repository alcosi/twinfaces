import { FieldPath, FieldValues } from "react-hook-form";

import { AutoFormDateRangeValueInfo } from "@/components/auto-field";
import {
  FormFieldProps,
  FormItemLabel,
  TextFormField,
} from "@/components/form-fields";

type Props<T extends FieldValues> = FormFieldProps<T> &
  AutoFormDateRangeValueInfo;

export function DateRangeFormField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: Props<T>) {
  return (
    <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-2">
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
        placeholder="from"
      />
      <TextFormField
        {...props}
        name={`${name}.to` as FieldPath<T>}
        control={control}
        type="date"
        placeholder="to"
      />
    </div>
  );
}
