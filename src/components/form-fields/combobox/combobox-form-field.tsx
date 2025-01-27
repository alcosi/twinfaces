import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import {
  cn,
  isEmptyArray,
  isEmptyString,
  isFalsy,
  isPopulatedString,
} from "@/shared/libs";
import { Combobox, ComboboxHandle, ComboboxProps } from "@/shared/ui/combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
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
        // TODO: Refactor after TWINFACES-207 - Combobox/select should fetch object value from field ID.
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
  fieldValue?: TFieldModel[] | string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  inForm?: boolean;
}) {
  const comboboxRef = useRef<ComboboxHandle<TFieldModel> | null>(null);

  useEffect(() => {
    applySelectedValues(fieldValue);
  }, [fieldValue]);

  async function applySelectedValues(values: TFieldModel[] | string) {
    if (isEmptyString(values)) {
      comboboxRef.current?.setSelected([]);
      return;
    }

    const selected = comboboxRef.current?.getSelected();

    if (isEmptyArray(selected)) {
      if (isFalsy(props.multi)) {
        if (isPopulatedString(values)) {
          const result = await props.getById(values);
          comboboxRef.current?.setSelected(result ? [result] : undefined);
          return;
        }

        comboboxRef.current?.setSelected(values.slice(-1));
      } else {
        comboboxRef.current?.setSelected(values);
      }
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
