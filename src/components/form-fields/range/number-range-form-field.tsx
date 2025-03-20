import { FieldPath, FieldValues } from "react-hook-form";

import { AutoFormNumberRangeValueInfo } from "@/components/auto-field";
import {
  FormFieldProps,
  FormItemLabel,
  TextFormField,
} from "@/components/form-fields";

type Props<T extends FieldValues> = FormFieldProps<T> &
  AutoFormNumberRangeValueInfo;

export function NumberRangeFormField<T extends FieldValues>({
  name,
  control,
  label,
  ...props
}: Props<T>) {
  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-2 gap-2">
      {label && (
        <div className="col-span-2">
          <FormItemLabel>{label}</FormItemLabel>
        </div>
      )}
      <TextFormField
        {...props}
        name={`${name}.from` as FieldPath<T>}
        control={control}
        type="number"
        placeholder={props.placeholderFrom ?? "from"}
      />

      <TextFormField
        {...props}
        name={`${name}.to` as FieldPath<T>}
        control={control}
        type="number"
        placeholder={props.placeholderFrom ?? "to"}
      />
    </div>
  );
}
