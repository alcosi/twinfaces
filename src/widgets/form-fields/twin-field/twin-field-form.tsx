import { FieldValues } from "react-hook-form";

import { FormFieldProps } from "@/components/form-fields";

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
  );
}
