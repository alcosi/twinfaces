import { ComponentProps } from "react";

import { Switch } from "@/shared/ui/switch";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

export function SwitchFormItem({
  fieldValue,
  onChange,
  label,
  description,
  inForm,
  ...props
}: FormItemProps & {
  inputId?: string;
  fieldValue?: boolean;
  onChange?: (value: boolean) => void;
} & Omit<ComponentProps<typeof Switch>, "checked" | "onCheckedChange">) {
  function onCheckedChange(x: boolean) {
    onChange?.(x);
  }

  return (
    <div className="flex flex-row items-start space-y-0 space-x-3">
      <Switch
        checked={fieldValue}
        onCheckedChange={onCheckedChange}
        {...props}
      />
      <div className="space-y-1 leading-none">
        {label && <FormItemLabel inForm={inForm}>{label}</FormItemLabel>}
        {description && (
          <FormItemDescription inForm={inForm}>
            {description}
          </FormItemDescription>
        )}
      </div>
    </div>
  );
}
