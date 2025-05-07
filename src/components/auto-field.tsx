import { Control, FieldPath } from "react-hook-form";

import { ComboboxProps, InputProps, TagBoxProps } from "@/shared/ui";
import {
  FeaturerFieldProps,
  FeaturerFormField,
  TwinFieldFormField,
  TwinFieldFormItem,
  TwinFieldFormItemProps,
} from "@/widgets/form-fields";

import {
  CheckboxFormField,
  CheckboxFormItem,
  ColorPickerFormField,
  ColorPickerFormItem,
  ComboboxFormField,
  ComboboxFormItem,
  NumberRangeFormField,
  TagsFormField,
  TagsFormItem,
  TextFormField,
  TextFormItem,
} from "./form-fields";

export enum AutoFormValueType {
  string = "string",
  number = "number",
  boolean = "boolean",
  uuid = "uuid",
  combobox = "combobox",
  featurer = "featurer",
  color = "color",
  tag = "tag",
  twinField = "twinField",
  numberRange = "numberRange",
}

/* eslint-enable no-unused-vars */

export type AutoFormValueInfo = AutoFormCommonInfo &
  (
    | AutoFormSimpleValueInfo
    | AutoFormTextValueInfo
    | AutoFormCheckboxValueInfo
    | AutoFormComboboxValueInfo
    | AutoFormTagValueInfo
    | AutoFormTwinFieldValueInfo
    | AutoFormFeaturerValueInfo
    | AutoFormColorValueInfo
    | AutoFormNumberRangeValueInfo
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

export type AutoFormTwinFieldValueInfo = TwinFieldFormItemProps & {
  type: AutoFormValueType.twinField;
};

export interface AutoFormFeaturerValueInfo extends FeaturerFieldProps {
  type: AutoFormValueType.featurer;
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

export interface AutoFormNumberRangeValueInfo {
  type: AutoFormValueType.numberRange;
  placeholderFrom?: string;
  placeholderTo?: string;
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
          <ComboboxFormItem fieldValue={value} onSelect={onChange} {...info} />
        );

      case AutoFormValueType.featurer:
        if (name && control) {
          return <FeaturerFormField name={name} control={control} {...info} />;
        } else {
          throw new Error(
            "AutoFormValueType.featurer requires both 'name' and 'control' properties. Ensure they are provided before rendering this field."
          );
        }

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

      case AutoFormValueType.twinField:
        if (info.twinClassId || info.twinId) {
          return name && control ? (
            <TwinFieldFormField
              name={name}
              control={control}
              label={info.label}
              description={info.description}
              {...info}
            />
          ) : (
            <TwinFieldFormItem
              fieldValue={value}
              label={info.label}
              description={info.description}
              {...info}
            />
          );
        }
        break;

      case AutoFormValueType.numberRange:
        return name && control ? (
          <NumberRangeFormField name={name} control={control} {...info} />
        ) : null;

      default:
        if (info.type === AutoFormValueType.string) {
          const { inputProps = {}, ...restInfo } = info;
          return name && control ? (
            <TextFormField
              {...restInfo}
              name={name}
              control={control}
              autoFocus={autoFocus}
              {...inputProps}
            />
          ) : (
            <TextFormItem
              {...restInfo}
              value={value}
              onChange={(e) => setValue(e?.target.value)}
              autoFocus={autoFocus}
              {...inputProps}
            />
          );
        }
    }
  }

  return renderField();
}
