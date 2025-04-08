import React from "react";

import {
  CheckboxFormItem,
  ComboboxFormItem,
  FormItemProps,
  TagsFormItem,
  TextFormItem,
} from "@/components/form-fields";

import { FeaturerParam, FeaturerParamType } from "@/entities/featurer";
import { Button } from "@/shared/ui";

import { useFeaturerParamTypesSelectAdapter } from "../../hooks";

export type FeaturerParamFormItemProps = {
  param: FeaturerParam;
};

type Props = FormItemProps &
  FeaturerParamFormItemProps & {
    fieldValue: string | undefined;
    onChange?: (value: unknown) => void;
  };

export function FeaturerParamFormItem({ param, onChange, ...props }: Props) {
  const adapter = useFeaturerParamTypesSelectAdapter(
    param.type as FeaturerParamType
  );

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    return onChange?.(event.target.value);
  }

  function handleOnCheckboxChange(value: boolean | "indeterminate") {
    onChange?.(value);
  }

  function handleOnComboboxSelect(
    items: [{ id: string }, ...{ id: string }[]]
  ) {
    const ids = items.map((item) => item.id).join(",");
    onChange?.(ids);
  }

  function renderByType() {
    switch (param.type) {
      case FeaturerParamType.BOOLEAN:
        return (
          <CheckboxFormItem
            onChange={(v) => handleOnCheckboxChange(v as boolean)}
            {...props}
            fieldValue={Boolean(props.fieldValue)}
          />
        );
      case FeaturerParamType.WORD_LIST:
        return <TagsFormItem {...props} fieldValue={props.fieldValue as any} />;
      case FeaturerParamType.STRING_TWINS_TWIN_TOUCH_ID:
      case FeaturerParamType.STRING_TWINS_TWIN_BASIC_FIELD:
      case FeaturerParamType.UUID_TWINS_TWIN_ID:
      case FeaturerParamType.UUID_TWINS_TWINFLOW_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_DATA_LIST_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_STATUS_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_ID:
      case FeaturerParamType.UUID_TWINS_PERMISSION_ID:
      case FeaturerParamType.UUID_TWINS_PERMISSION_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_LINK_ID:
        return (
          <ComboboxFormItem
            // TODO: find solution to remove `any`
            {...(adapter as any)}
            onSelect={handleOnComboboxSelect}
            {...props}
          />
        );
      case FeaturerParamType.UUID_SET_TWINS_USER_GROUP_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_STATUS_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_FIELD_ID:
      case FeaturerParamType.WORD_LIST_TWINS_TWIN_BASIC_FIELD:
      case FeaturerParamType.UUID_SET_TWINS_LINK_ID:
        return (
          <ComboboxFormItem
            // TODO: find solution to remove `any`
            {...(adapter as any)}
            multi={true}
            onSelect={handleOnComboboxSelect}
            {...props}
          />
        );
      case FeaturerParamType.INT:
      case FeaturerParamType.DOUBLE:
        return (
          <TextFormItem type="number" onChange={handleTextChange} {...props} />
        );
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_SCHEMA_ID:
        return (
          <Button variant="destructive" className="block" disabled>
            Blocked type - {param.type}
          </Button>
        );
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_FIELD_ID:
        return (
          <Button variant="outline" className="block" disabled>
            Not implemented
          </Button>
        );
      case FeaturerParamType.STRING:
      case FeaturerParamType.UUID:
      case FeaturerParamType.UUID_TWINS_MARKER_ID:
      default:
        return <TextFormItem onChange={handleTextChange} {...props} />;
    }
  }

  return renderByType();
}
