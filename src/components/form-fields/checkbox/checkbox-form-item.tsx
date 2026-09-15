import { CheckboxProps } from "@radix-ui/react-checkbox";

import { cn } from "@/shared/libs";
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
  inputId,
  inline,
  ...props
}: FormItemProps & {
  fieldValue?: boolean | "indeterminate";
  onChange?: (value: boolean | "indeterminate") => void;
  hasIndeterminate?: boolean;
  /** Puts the label and the box on one row — used by the filter panels. */
  inline?: boolean;
} & Omit<CheckboxProps, "checked" | "onCheckedChange" | "type">) {
  function onCheckedChange(x: boolean) {
    if (hasIndeterminate && fieldValue === false && x === true) {
      onChange?.("indeterminate");
    } else {
      onChange?.(x);
    }
  }

  const checkbox = (
    <Checkbox
      id={inputId}
      checked={
        hasIndeterminate && fieldValue === undefined
          ? "indeterminate"
          : fieldValue
      }
      onCheckedChange={onCheckedChange}
      {...props}
      className={cn(inline && "border-muted-foreground/40", props.className)}
      type="button"
    />
  );

  if (inline) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          {label && (
            <FormItemLabel inForm={inForm}>
              {label}
              {props.required && <span className="text-destructive">*</span>}
            </FormItemLabel>
          )}
          {description && (
            <FormItemDescription inForm={inForm}>
              {description}
            </FormItemDescription>
          )}
        </div>
        {checkbox}
      </div>
    );
  }

  return (
    <>
      {label && (
        <FormItemLabel inForm={inForm}>
          {label}
          {props.required && <span className="text-destructive">*</span>}
        </FormItemLabel>
      )}
      <div className="flex flex-row items-start space-y-0 space-x-3">
        {checkbox}
        <div className="space-y-1 leading-none">
          {description && (
            <FormItemDescription inForm={inForm}>
              {description}
            </FormItemDescription>
          )}
        </div>
      </div>
    </>
  );
}
