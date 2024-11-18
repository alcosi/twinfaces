import { ComboboxProps } from "@/components/base/combobox";
import {
  CheckboxFormField,
  CheckboxFormItem,
} from "@/components/form-fields/checkbox-form-field";
import {
  ColorPickerFormField,
  ColorPickerFormItem,
} from "@/components/form-fields/color-form-field";
import {
  ComboboxFormField,
  ComboboxFormItem,
} from "@/components/form-fields/combobox";
import {
  FeaturerFormField,
  FeaturerFormItem,
} from "@/components/form-fields/featurer-form-field";
import {
  TextFormField,
  TextFormItem,
} from "@/components/form-fields/text-form-field";
import { Control, FieldPath } from "react-hook-form";

export enum AutoFormValueType {
  string = "string",
  number = "number",
  boolean = "boolean",
  uuid = "uuid",
  combobox = "combobox",
  featurer = "featurer",
  select = "select",
  color = "color",
}
/* eslint-enable no-unused-vars */

export type AutoFormValueInfo = AutoFormCommonInfo &
  (
    | AutoFormSimpleValueInfo
    | AutoFormCheckboxValueInfo
    | AutoFormComboboxValueInfo
    | AutoFormFeaturerValueInfo
    | AutoFormSelectValueInfo
    | AutoFormColorValueInfo
  );

export interface AutoFormCommonInfo {
  label: string;
  description?: string;
  defaultValue?: any;
}

export interface AutoFormSimpleValueInfo {
  type:
    | AutoFormValueType.string
    | AutoFormValueType.number
    | AutoFormValueType.uuid;
}

export interface AutoFormCheckboxValueInfo {
  type: AutoFormValueType.boolean;
  hasIndeterminate?: boolean;
}

export interface AutoFormComboboxValueInfo extends ComboboxProps<any> {
  type: AutoFormValueType.combobox;
  // TODO combobox value type
}

export interface AutoFormFeaturerValueInfo {
  type: AutoFormValueType.featurer;
  typeId: number;
  paramsName?: FieldPath<any>;
}

export interface AutoFormSelectValueInfo {
  type: AutoFormValueType.select;
  options: string[];
}

export interface AutoFormFieldProps {
  info: AutoFormValueInfo;
  value?: any;
  onChange?: (value: any) => any;
  name?: FieldPath<any>;
  control?: Control<any>;
}

export interface AutoFormColorValueInfo {
  type: AutoFormValueType.color;
}

export function AutoField({
  info,
  value,
  onChange,
  name,
  control,
}: AutoFormFieldProps) {
  function setValue(newValue: any) {
    onChange?.(newValue);
  }

  // boolean has a different structure (label after control), so we need to handle it separately
  if (info.type === AutoFormValueType.boolean) {
    return name && control ? (
      <CheckboxFormField {...info} name={name} control={control} />
    ) : (
      <CheckboxFormItem
        {...info}
        fieldValue={value}
        onChange={(x) => setValue(x)}
      />
    );
  } else if (info.type === AutoFormValueType.combobox) {
    return name && control ? (
      <ComboboxFormField name={name} control={control} {...info} />
    ) : (
      <ComboboxFormItem
        fieldValue={value}
        onSelect={onChange}
        description={info.description}
        {...info}
      />
    );
  } else if (info.type === AutoFormValueType.featurer) {
    return name && control && info.paramsName ? (
      <FeaturerFormField
        name={name}
        control={control}
        paramsName={info.paramsName}
        {...info}
      />
    ) : (
      <FeaturerFormItem {...info} />
    );
  } else if (info.type === AutoFormValueType.color) {
    return name && control ? (
      <ColorPickerFormField name={name} control={control} {...info} />
    ) : (
      <ColorPickerFormItem fieldValue={value} {...info} />
    );
  } else {
    return name && control ? (
      <TextFormField {...info} name={name} control={control} />
    ) : (
      <TextFormItem
        {...info}
        value={value}
        onChange={(e) => setValue(e?.target.value)}
      />
    );
    // return <TextItem {...info} value={value} onChange={(e) => setValue(e?.target.value)}/>
  }
}
