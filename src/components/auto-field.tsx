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
import { ComboboxProps } from "@/shared/ui/combobox";
import { Control, FieldPath } from "react-hook-form";
import { TagsFormField, TagsFormItem } from "./form-fields/tags-form-field";
import { TagBoxProps } from "@/shared/ui";
import { InputProps } from "@/shared/ui/input";

export enum AutoFormValueType {
  string = "string",
  number = "number",
  boolean = "boolean",
  uuid = "uuid",
  combobox = "combobox",
  featurer = "featurer",
  select = "select",
  color = "color",
  tag = "tag",
}

/* eslint-enable no-unused-vars */

export type AutoFormValueInfo = AutoFormCommonInfo &
  (
    | AutoFormSimpleValueInfo
    | AutoFormTextValueInfo
    | AutoFormCheckboxValueInfo
    | AutoFormSelectValueInfo
    | AutoFormComboboxValueInfo
    | AutoFormTagValueInfo
    | AutoFormFeaturerValueInfo
    | AutoFormColorValueInfo
  );

export interface AutoFormCommonInfo {
  label?: string;
  description?: string;
  defaultValue?: any;
}

export interface AutoFormTextValueInfo {
  type: AutoFormValueType.string;
  inputProps?: InputProps;
}

export interface AutoFormSimpleValueInfo {
  type: AutoFormValueType.number | AutoFormValueType.uuid;
}

export interface AutoFormCheckboxValueInfo {
  type: AutoFormValueType.boolean;
  hasIndeterminate?: boolean;
}

export interface AutoFormComboboxValueInfo extends ComboboxProps<any> {
  type: AutoFormValueType.combobox;
}

export interface AutoFormTagValueInfo
  extends Partial<Pick<HTMLInputElement, "placeholder">> {
  type: AutoFormValueType.tag;
  schema?: TagBoxProps<string>["schema"];
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
  autoFocus?: boolean;
  onCancel?: () => any;
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
  autoFocus,
  onCancel,
}: AutoFormFieldProps) {
  function setValue(newValue: any) {
    onChange?.(newValue);
  }

  function renderField() {
    switch (info.type) {
      case AutoFormValueType.boolean:
        return name && control ? (
          <CheckboxFormField
            {...info}
            name={name}
            control={control}
            autoFocus={autoFocus}
          />
        ) : (
          <CheckboxFormItem
            {...info}
            fieldValue={value}
            onChange={setValue}
            autoFocus={autoFocus}
          />
        );

      case AutoFormValueType.combobox:
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

      case AutoFormValueType.featurer:
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

      case AutoFormValueType.color:
        return name && control ? (
          <ColorPickerFormField name={name} control={control} {...info} />
        ) : (
          <ColorPickerFormItem fieldValue={value} {...info} />
        );

      case AutoFormValueType.tag:
        return name && control ? (
          <TagsFormField name={name} control={control} {...info} />
        ) : (
          <TagsFormItem fieldValue={value} {...info} />
        );

      default:
        return name && control ? (
          <TextFormField
            {...info}
            name={name}
            control={control}
            autoFocus={autoFocus}
            {...(info.type == AutoFormValueType.string ? info.inputProps : {})}
          />
        ) : (
          <TextFormItem
            {...info}
            value={value}
            onChange={(e) => setValue(e?.target.value)}
            autoFocus={autoFocus}
            {...(info.type == AutoFormValueType.string ? info.inputProps : {})}
          />
        );
    }
  }

  return renderField();
}
