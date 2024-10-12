import { Checkbox } from "@/components/base/checkbox";
import { FormField } from "@/components/base/form";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";

export function CheckboxFormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  hasIndeterminate,
}: FormFieldProps<T> & { hasIndeterminate?: boolean }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <CheckboxFormItem
          fieldValue={field.value}
          onChange={(x) => field.onChange(x)}
          label={label}
          description={description}
          hasIndeterminate={hasIndeterminate}
          inForm={true}
        />
      )}
    />
  );
}

export function CheckboxFormItem({
  fieldValue,
  onChange,
  label,
  description,
  inForm,
  hasIndeterminate,
}: {
  fieldValue?: boolean | "indeterminate";
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: boolean | "indeterminate") => any;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  inputId?: string;
  inForm?: boolean;
  hasIndeterminate?: boolean;
}) {
  function onCheckedChange(x: boolean) {
    console.log(
      "onCheckedChange",
      x,
      "hasIndeterminate",
      hasIndeterminate,
      "fieldValue",
      fieldValue
    );
    if (hasIndeterminate && fieldValue === false && x === true) {
      onChange?.("indeterminate");
    } else {
      onChange?.(x);
    }
  }

  return (
    <div className="flex flex-row items-start space-x-3 space-y-0">
      {/*<FormControl>*/}
      <Checkbox
        checked={
          hasIndeterminate && fieldValue === undefined
            ? "indeterminate"
            : fieldValue
        }
        onCheckedChange={onCheckedChange}
      />
      {/*</FormControl>*/}
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
