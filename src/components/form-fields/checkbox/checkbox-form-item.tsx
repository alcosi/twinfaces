import { CheckboxProps } from "@radix-ui/react-checkbox";

import { Checkbox } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

export function CheckboxFormItem({
  fieldValue,
  onChange,
  label,
  description,
  inForm,
  hasIndeterminate,
  ...props
}: FormItemProps & {
  inputId?: string;
  fieldValue?: boolean | "indeterminate";
  onChange?: (value: boolean | "indeterminate") => void;
  hasIndeterminate?: boolean;
} & Omit<CheckboxProps, "checked" | "onCheckedChange" | "type">) {
  function onCheckedChange(x: boolean) {
    if (hasIndeterminate && fieldValue === false && x === true) {
      onChange?.("indeterminate");
    } else {
      onChange?.(x);
    }
  }

  return (
    <div className="flex flex-row items-start space-y-0 space-x-3">
      <Checkbox
        checked={
          hasIndeterminate && fieldValue === undefined
            ? "indeterminate"
            : fieldValue
        }
        onCheckedChange={onCheckedChange}
        {...props}
        type="button"
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
