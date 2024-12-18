import { CheckboxFormItem } from "@/components/form-fields/checkbox-form-field";
import { TagsFormItem } from "@/components/form-fields/tags-form-field";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { FeaturerParam, FeaturerParamTypes } from "@/entities/featurer";
import { useEffect } from "react";

interface FeaturerParamInputProps {
  param: FeaturerParam;
  value: string;
  onChange: (key: string, value: string) => void;
}

const ParamTypes: Record<FeaturerParamTypes, FeaturerParamTypes> = {
  BOOLEAN: "BOOLEAN",
  STRING: "STRING",
  INT: "INT",
  WORD_LIST: "WORD_LIST",
  DOUBLE: "DOUBLE",
  "WORD_LIST:TWINS_TWIN_BASIC_FIELD": "WORD_LIST:TWINS_TWIN_BASIC_FIELD",
  "STRING:TWINS_TWIN_TOUCH_ID": "STRING:TWINS_TWIN_TOUCH_ID",
  "UUID_SET:TWINS_USER_GROUP_ID": "UUID_SET:TWINS_USER_GROUP_ID",
  "UUID:TWINS_PERMISSION_SCHEMA_ID": "UUID:TWINS_PERMISSION_SCHEMA_ID",
  "UUID:TWINS_TWIN_CLASS_SCHEMA_ID": "UUID:TWINS_TWIN_CLASS_SCHEMA_ID",
  "UUID:TWINS_TWINFLOW_SCHEMA_ID": "UUID:TWINS_TWINFLOW_SCHEMA_ID",
  "UUID:TWINS_TWIN_ID": "UUID:TWINS_TWIN_ID",
  "UUID:TWINS_LINK_ID": "UUID:TWINS_LINK_ID",
  "UUID:TWINS_DATA_LIST_ID": "UUID:TWINS_DATA_LIST_ID",
  "UUID_SET:TWINS_TWIN_STATUS_ID": "UUID_SET:TWINS_TWIN_STATUS_ID",
  "UUID:TWINS_TWIN_CLASS_FIELD_ID": "UUID:TWINS_TWIN_CLASS_FIELD_ID",
  UUID: "UUID",
  "UUID_SET:TWINS_TWIN_CLASS_ID": "UUID_SET:TWINS_TWIN_CLASS_ID",
  "UUID:TWINS_TWIN_CLASS_ID": "UUID:TWINS_TWIN_CLASS_ID",
  "UUID:TWINS_TWIN_STATUS_ID": "UUID:TWINS_TWIN_STATUS_ID",
  "UUID:TWINS_MARKER_ID": "UUID:TWINS_MARKER_ID",
  "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID": "UUID_SET:TWINS_TWIN_CLASS_FIELD_ID",
  "UUID:TWINS_PERMISSION_ID": "UUID:TWINS_PERMISSION_ID",
  "UUID_SET:TWINS_LINK_ID": "UUID_SET:TWINS_LINK_ID",
  "STRING:TWINS_TWIN_BASIC_FIELD": "STRING:TWINS_TWIN_BASIC_FIELD",
} as const;

export function FeaturerParamInput({
  param,
  value,
  onChange,
}: FeaturerParamInputProps) {
  // const [value, setValue] = useState<string>('');

  useEffect(() => {
    // TODO remove hardcoded decimalSeparator default value when there are default values in the API
    if (param.key === "decimalSeparator") {
      // setValue('.')
      onChange(param.key!, ".");
      return;
    }

    onChange(param.key!, value);
  }, []);

  useEffect(() => {
    onChange(param.key!, value);
  }, [value]);

  function setValue(newValue: string) {
    onChange(param.key!, newValue);
  }

  function renderParamFieldByType() {
    const type: FeaturerParamTypes = param.type as FeaturerParamTypes;
    console.log("foobar renderParamFieldByType", param.name, { value }, param);

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
      case ParamTypes["UUID_SET:TWINS_USER_GROUP_ID"]:
      case ParamTypes["UUID:TWINS_PERMISSION_SCHEMA_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_CLASS_SCHEMA_ID"]:
      case ParamTypes["UUID:TWINS_TWINFLOW_SCHEMA_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_ID"]:
      case ParamTypes["UUID:TWINS_LINK_ID"]:
      case ParamTypes["UUID:TWINS_DATA_LIST_ID"]:
      case ParamTypes["UUID_SET:TWINS_TWIN_STATUS_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_CLASS_FIELD_ID"]:
      case ParamTypes.UUID:
      case ParamTypes["UUID_SET:TWINS_TWIN_CLASS_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_CLASS_ID"]:
      case ParamTypes["UUID:TWINS_TWIN_STATUS_ID"]:
      case ParamTypes["UUID:TWINS_MARKER_ID"]:
      case ParamTypes["UUID_SET:TWINS_TWIN_CLASS_FIELD_ID"]:
      case ParamTypes["UUID:TWINS_PERMISSION_ID"]:
      case ParamTypes["UUID_SET:TWINS_LINK_ID"]:
        // TODO: add schema: UUID
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
