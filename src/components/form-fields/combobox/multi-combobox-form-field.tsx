import {
  ComboboxHandle,
  MultiCombobox,
  MultiComboboxProps,
} from "@/components/base/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/base/form";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { cn } from "@/shared/libs";
import React, { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";

type Props<T extends FieldValues, K> = FormFieldProps<T> &
  MultiComboboxProps<K>;

export function MultiComboboxFormField<
  TFormModel extends FieldValues,
  TFieldModel,
>({
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
      render={({ field }) => (
        <MultiComboboxFormItem
          label={label}
          description={description}
          required={required}
          buttonClassName={buttonClassName}
          onSelect={field.onChange}
          fieldValue={field.value}
          inForm={true}
          {...props}
        />
      )}
    />
  );
}

export function MultiComboboxFormItem<TFieldModel>({
  fieldValue = [],
  onSelect,
  label,
  description,
  required,
  buttonClassName,
  inForm,
  ...props
}: MultiComboboxProps<TFieldModel> & {
  fieldValue?: TFieldModel[];
  onSelect?: (value?: TFieldModel[]) => any;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  inForm?: boolean;
}) {
  const multiComboboxRef = useRef<ComboboxHandle<TFieldModel> | null>(null);

  useEffect(() => {
    applySelectedValues(fieldValue);
  }, [fieldValue]);

  function applySelectedValues(values: TFieldModel[]) {
    if (!values?.length) return;

    if (props.multi) {
      multiComboboxRef.current?.setSelected(values);
    } else if (values.length > 0) {
      multiComboboxRef.current?.setSelected(values.slice(-1));
    }
  }

  return (
    <FormItem>
      {label && (
        <FormItemLabel>
          {label} {required && <span className="text-red-500">*</span>}
        </FormItemLabel>
      )}
      <FormControl>
        <MultiCombobox<TFieldModel>
          ref={multiComboboxRef}
          onSelect={onSelect}
          buttonClassName={cn("w-full", buttonClassName)}
          {...props}
        />
      </FormControl>
      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}
      {inForm && <FormMessage />}
    </FormItem>
  );
}
