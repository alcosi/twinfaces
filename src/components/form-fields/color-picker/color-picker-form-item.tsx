import { ColorPicker } from "@/shared/ui/color-picker";
import { FormControl, FormItem, FormMessage } from "@/shared/ui/form";
import { Component } from "react";
import { FormItemProps } from "../types";
import { FormItemDescription, FormItemLabel } from "../form-items-common";

export class ColorPickerFormItem extends Component<
  FormItemProps & {
    fieldValue: string;
    onChange?: (value: string) => any;
  }
> {
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
