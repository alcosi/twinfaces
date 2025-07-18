import { FieldValues } from "react-hook-form";

import { ComboboxProps, FormField } from "@/shared/ui";

import { FormFieldProps } from "../types";
import { ComboboxFormItem } from "./combobox-form-item";

type Props<T extends FieldValues, K> = FormFieldProps<T> & ComboboxProps<K>;

export function ComboboxFormField<TFormModel extends FieldValues, TFieldModel>({
  name,
  control,
  label,
  description,
  required,
  buttonClassName,
  ...props
}: Props<TFormModel, TFieldModel>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // TODO: Refactor after TWINFACES-207 - Combobox/select should fetch object value from field ID.
        const _fieldValue = props.initialValues ?? field.value;
        return (
          <ComboboxFormItem
            label={label}
            description={description}
            required={required}
            buttonClassName={buttonClassName}
            fieldValue={_fieldValue}
            inForm={true}
            {...props}
            onSelect={(event) => {
              props.onSelect?.(event);
              return field.onChange(event);
            }}
          />
        );
      }}
    />
  );
}
