import { Combobox, ComboboxHandle, ComboboxProps } from "@/shared/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { cn } from "@/shared/libs";
import React, { useEffect, useRef } from "react";
import { FieldValues } from "react-hook-form";

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
        const _fieldValue = props.initialValues ?? field.value;
        return (
          <ComboboxFormItem
            label={label}
            description={description}
            required={required}
            buttonClassName={buttonClassName}
            onSelect={field.onChange}
            fieldValue={_fieldValue}
            inForm={true}
            {...props}
          />
        );
      }}
    />
  );
}

export function ComboboxFormItem<TFieldModel>({
  fieldValue = [],
  onSelect,
  label,
  description,
  required,
  buttonClassName,
  inForm,
  ...props
}: ComboboxProps<TFieldModel> & {
  fieldValue?: TFieldModel[];
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  inForm?: boolean;
}) {
  const comboboxRef = useRef<ComboboxHandle<TFieldModel> | null>(null);

  useEffect(() => {
    applySelectedValues(fieldValue);
  }, [fieldValue]);

  function applySelectedValues(values: TFieldModel[]) {
    if (!values?.length) return;

    if (props.multi) {
      comboboxRef.current?.setSelected(values);
    } else if (values.length > 0) {
      comboboxRef.current?.setSelected(values.slice(-1));
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
        <Combobox<TFieldModel>
          ref={comboboxRef}
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
