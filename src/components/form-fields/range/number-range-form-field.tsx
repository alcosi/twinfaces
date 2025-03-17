import React from "react";
import { FieldPath, FieldValues } from "react-hook-form";

import { AutoFormNumberRangeValueInfo } from "@/components/auto-field";
import { FormFieldProps, TextFormItem } from "@/components/form-fields";

import { FormField } from "@/shared/ui";

interface NumberRangeFormFieldProps<T extends FieldValues>
  extends FormFieldProps<T>,
    Omit<NumberRangeFormItemProps, "fieldValue" | "onChange"> {
  idPrefix?: string;
  label?: React.ReactNode;
}

interface NumberRangeFormItemProps
  extends Omit<AutoFormNumberRangeValueInfo, "label"> {
  fieldValue?: { from: number | undefined; to: number | undefined };
  onChange?: (value: {
    from: number | undefined;
    to: number | undefined;
  }) => void;
  autoFocus?: boolean;
  inputId?: string;
  inForm?: boolean;
  label?: React.ReactNode;
}

export function NumberRangeFormField<T extends FieldValues>({
  name,
  control,
  idPrefix,
  type,
  label,
  ...props
}: NumberRangeFormFieldProps<T>) {
  const inputId = idPrefix ? `${idPrefix}-${name}` : undefined;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormField
            control={control}
            name={`${name}.from` as FieldPath<T>}
            render={({ field }) => {
              return (
                <TextFormItem
                  autoFocus={props.autoFocus}
                  fieldValue={field.value}
                  onChange={(x) => field.onChange(x)}
                  inputId={inputId ? `${inputId}-from` : undefined}
                  inForm={true}
                  type="number"
                  placeholder={
                    props.placeholderFrom ? props.placeholderFrom : "from"
                  }
                  {...props}
                />
              );
            }}
          />
        </div>

        <div className="flex-1">
          <FormField
            control={control}
            name={`${name}.to` as FieldPath<T>}
            render={({ field }) => {
              return (
                <TextFormItem
                  fieldValue={field.value}
                  onChange={(x) => field.onChange(x)}
                  inputId={inputId ? `${inputId}-to` : undefined}
                  inForm={true}
                  type="number"
                  placeholder={
                    props.placeholderFrom ? props.placeholderFrom : "to"
                  }
                  {...props}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
