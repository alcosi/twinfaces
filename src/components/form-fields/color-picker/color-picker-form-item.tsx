import { Component } from "react";

import { ColorPicker, FormControl, FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

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
          <ColorPicker color={fieldValue} onChange={onChange} />
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
