import { ComponentProps } from "react";

import { Switch } from "@/shared/ui/switch";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { RequiredMark } from "../required-mode";
import { FormItemProps } from "../types";

export function SwitchFormItem({
  fieldValue,
  onChange,
  label,
  description,
  inForm,
  inputId,
  ...props
}: FormItemProps & {
  fieldValue?: boolean;
  onChange?: (value: boolean) => void;
} & Omit<ComponentProps<typeof Switch>, "checked" | "onCheckedChange">) {
  function onCheckedChange(x: boolean) {
    onChange?.(x);
  }

  const control = (
    <Switch
      id={inputId}
      checked={fieldValue}
      onCheckedChange={onCheckedChange}
      {...props}
    />
  );

  if (!label) {
    return (
      <div className="flex flex-row items-start space-y-0 space-x-3">
        {control}
        {description && (
          <div className="space-y-1 leading-none">
            <FormItemDescription inForm={inForm}>
              {description}
            </FormItemDescription>
          </div>
        )}
      </div>
    );
  }

  // Label on the left, toggle pushed to the right edge of the row.
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <FormItemLabel inForm={inForm}>
          {label}
          <RequiredMark required={props.required} />
        </FormItemLabel>
        {description && (
          <FormItemDescription inForm={inForm}>
            {description}
          </FormItemDescription>
        )}
      </div>
      {control}
    </div>
  );
}
