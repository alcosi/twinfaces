import { ColorPicker } from "@/components/base/color-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/base/form";
import {
  FormFieldProps,
  FormItemDescription,
  FormItemLabel,
} from "@/components/form-fields/form-fields-common";
import { Component, ReactNode } from "react";
import { FieldValues } from "react-hook-form";

export function ColorPickerFormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <ColorPickerFormItem
          label={label}
          description={description}
          fieldValue={field.value}
          onChange={field.onChange}
          inForm={true}
        />
      )}
    />
  );
}

export class ColorPickerFormItem extends Component<{
  fieldValue: string;
  onChange?: (value: string) => any;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  inForm?: boolean;
}> {
  render() {
    let { fieldValue, onChange, label, description, inForm } = this.props;
    return (
      <FormItem>
        {label && <FormItemLabel inForm={inForm}>{label}</FormItemLabel>}
        <FormControl>
          <ColorPicker value={fieldValue} onChange={onChange} />
        </FormControl>
        {description && (
          <FormItemDescription inForm={inForm}>
            {description}
          </FormItemDescription>
        )}
        {inForm && <FormMessage />}
      </FormItem>
    );
  }
}
