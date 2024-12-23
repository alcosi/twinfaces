import { CheckboxFormItem } from "@/components/form-fields/checkbox-form-field";
import { TagsFormItem } from "@/components/form-fields/tags-form-field";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { FeaturerParam, FeaturerParamTypes } from "@/entities/featurer";
import { ParamTypes } from "./types";

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
    const type: FeaturerParamTypes = param.type as FeaturerParamTypes;

    switch (type) {
      case ParamTypes.BOOLEAN:
        return (
          <CheckboxFormItem
            name={param.name}
            label={param.name}
            description={param.description}
            fieldValue={value === "true"}
            onChange={(newChecked) => setValue(newChecked ? "true" : "false")}
          />
        );
      case ParamTypes["UUID:TWINS_PERMISSION_SCHEMA_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_CLASS_SCHEMA_ID"]:
      case ParamTypes["UUID:TWINS_TWINFLOW_SCHEMA_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_ID"]:
      case ParamTypes["UUID:TWINS_LINK_ID"]:
      case ParamTypes["UUID:TWINS_DATA_LIST_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_CLASS_FIELD_ID"]:
      case ParamTypes.UUID:
      case ParamTypes["UUID:TWINS_TWIN_CLASS_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_STATUS_ID"]:
      case ParamTypes["UUID:TWINS_MARKER_ID"]:
      case ParamTypes["UUID:TWINS_PERMISSION_ID"]:
        return (
          <TextFormItem
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label={param.name}
            name={param.name}
            description={param.description}
          />
        );
      case ParamTypes["UUID_SET:TWINS_USER_GROUP_ID"]:
      case ParamTypes["UUID_SET:TWINS_TWIN_STATUS_ID"]:
      case ParamTypes["UUID_SET:TWINS_TWIN_CLASS_ID"]:
      case ParamTypes["UUID_SET:TWINS_TWIN_CLASS_FIELD_ID"]:
      case ParamTypes["UUID_SET:TWINS_LINK_ID"]:
        return (
          <TagsFormItem
            name={param.name}
            label={param.name}
            description={param.description}
            value={value}
          />
        );
      case ParamTypes.WORD_LIST:
      case ParamTypes["WORD_LIST:TWINS_TWIN_BASIC_FIELD"]:
        return (
          <TagsFormItem
            name={param.name}
            label={param.name}
            description={param.description}
            value={value}
          />
        );
      case ParamTypes.INT:
      case ParamTypes.DOUBLE:
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
      case ParamTypes.STRING:
      case ParamTypes["STRING:TWINS_TWIN_BASIC_FIELD"]:
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
