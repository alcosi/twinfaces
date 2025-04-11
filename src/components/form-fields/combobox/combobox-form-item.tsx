import React, { useEffect, useRef } from "react";

import {
  cn,
  isEmptyArray,
  isEmptyString,
  isFalsy,
  isPopulatedArray,
  isPopulatedString,
  isTruthy,
} from "@/shared/libs";
import {
  Combobox,
  ComboboxHandle,
  ComboboxProps,
  FormControl,
  FormItem,
  FormMessage,
} from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";

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
          comboboxRef.current?.setSelected(
            isTruthy(result) ? [result] : undefined
          );
          return;
        }

        comboboxRef.current?.setSelected(
          isPopulatedArray(values) ? values.slice(-1) : []
        );
      } else {
        comboboxRef.current?.setSelected(values);
      }
    }
  }

  return (
    <FormItem className="w-full">
      {label && (
        <FormItemLabel>
          {label} {required && <span className="text-destructive">*</span>}
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
