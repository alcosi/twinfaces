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
  }, [JSON.stringify(fieldValue)]);

  async function applySelectedValues(values: TFieldModel[] | string) {
    if (isEmptyString(values)) {
      comboboxRef.current?.setSelected([]);
      return;
    }

    const selected = comboboxRef.current?.getSelected();

    if (isEmptyArray(selected)) {
      // A string value carries ids — several comma-separated ones when the
      // source field is multi-valued — so each has to be resolved on its own.
      if (isPopulatedString(values)) {
        const ids = values
          .split(",")
          .map((id) => id.trim())
          .filter(isPopulatedString);

        const resolved = await Promise.all(
          (isFalsy(props.multi) ? ids.slice(0, 1) : ids).map((id) =>
            props.getById(id)
          )
        );

        comboboxRef.current?.setSelected(resolved.filter(isTruthy));
        return;
      }

      if (isFalsy(props.multi)) {
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
