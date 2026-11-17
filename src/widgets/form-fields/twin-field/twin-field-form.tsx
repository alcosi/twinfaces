import { FieldValues } from "react-hook-form";

import { FormFieldProps, RequiredFieldsGate } from "@/components/form-fields";

import { FormField } from "@/shared/ui";

import { TwinFieldFormItem, TwinFieldFormItemProps } from "./twin-field-item";

type Props<T extends FieldValues> = FormFieldProps<T> & TwinFieldFormItemProps;

// TODO: move to `@/features/`
export function TwinFieldFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  ...props
}: Props<T>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    // A class field follows the create form's "required only" mode like any
    // static field does: its `required` comes from the twin class field.
    <RequiredFieldsGate required={props.required}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <TwinFieldFormItem
              fieldValue={field.value}
              onChange={(x) => field.onChange(x)}
              {...props}
              inputId={inputId}
              inForm={true}
            />
          );
        }}
      />
    </RequiredFieldsGate>
  );
}
