import { CheckboxFormItem } from "@/components/form-fields/checkbox-form-field";
import { TagsFormItem } from "@/components/form-fields/tags-form-field";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { FeaturerParam, FeaturerParamType } from "@/entities/featurer";

interface FeaturerParamInputProps {
  param: FeaturerParam;
  value: string;
  onChange: (key: string, value: string) => void;
}

export function FeaturerParamInput({
  param,
  value,
  onChange,
}: FeaturerParamInputProps) {
  function setValue(newValue: string) {
    onChange(param.key!, newValue);
  }

  function renderParamFieldByType() {
    switch (param.type) {
      case FeaturerParamType.BOOLEAN:
        return (
          <CheckboxFormItem
            name={param.name}
            label={param.name}
            description={param.description}
            fieldValue={value === "true"}
            onChange={(newChecked) => setValue(newChecked ? "true" : "false")}
          />
        );
      case FeaturerParamType.UUID_TWINS_PERMISSION_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_TWINFLOW_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_ID:
      case FeaturerParamType.UUID_TWINS_LINK_ID:
      case FeaturerParamType.UUID_TWINS_DATA_LIST_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_FIELD_ID:
      case FeaturerParamType.UUID:
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_STATUS_ID:
      case FeaturerParamType.UUID_TWINS_MARKER_ID:
      case FeaturerParamType.UUID_TWINS_PERMISSION_ID:
        return (
          <TextFormItem
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label={param.name}
            name={param.name}
            description={param.description}
          />
        );
      case FeaturerParamType.UUID_SET_TWINS_USER_GROUP_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_STATUS_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_FIELD_ID:
      case FeaturerParamType.UUID_SET_TWINS_LINK_ID:
        return (
          <TagsFormItem
            name={param.name}
            label={param.name}
            description={param.description}
            value={value}
          />
        );
      case FeaturerParamType.WORD_LIST:
      case FeaturerParamType.WORD_LIST_TWINS_TWIN_BASIC_FIELD:
        return (
          <TagsFormItem
            name={param.name}
            label={param.name}
            description={param.description}
            value={value}
          />
        );
      case FeaturerParamType.INT:
      case FeaturerParamType.DOUBLE:
        return (
          <TextFormItem
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label={param.name}
            name={param.name}
            description={param.description}
          />
        );
      case FeaturerParamType.STRING:
      case FeaturerParamType.STRING_TWINS_TWIN_BASIC_FIELD:
      default:
        return (
          <TextFormItem
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label={param.name}
            name={param.name}
            description={param.description}
          />
        );
    }
  }

  return renderParamFieldByType();
}
