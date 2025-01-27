import { CheckboxFormItem } from "@/components/form-fields/checkbox-form-field";
import { ComboboxFormItem } from "@/components/form-fields/combobox";
import { TagsFormItem } from "@/components/form-fields/tags-form-field";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import { FeaturerParam, FeaturerParamType } from "@/entities/featurer";
import { Button } from "@/shared/ui";
import { useFeaturerParamTypesSelectAdapter } from "./hooks";

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
  const adapter = useFeaturerParamTypesSelectAdapter(
    param.type as FeaturerParamType
  );

  function setValue(newValue: string) {
    onChange(param.key!, newValue);
  }

  function renderParamFieldByType() {
    switch (param.type) {
      case FeaturerParamType.BOOLEAN:
        return (
          <CheckboxFormItem
            label={param.name}
            description={param.description}
            fieldValue={value === "true"}
            onChange={(newChecked) => setValue(newChecked ? "true" : "false")}
          />
        );
      case FeaturerParamType.WORD_LIST:
        return (
          <TagsFormItem
            label={param.name}
            description={param.description}
            value={value}
          />
        );
      case FeaturerParamType.STRING_TWINS_TWIN_TOUCH_ID:
      case FeaturerParamType.STRING_TWINS_TWIN_BASIC_FIELD:
      case FeaturerParamType.UUID_TWINS_TWIN_ID:
      case FeaturerParamType.UUID_TWINS_TWINFLOW_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_DATA_LIST_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_STATUS_ID:
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_ID:
      case FeaturerParamType.UUID_TWINS_PERMISSION_ID:
      case FeaturerParamType.UUID_TWINS_PERMISSION_SCHEMA_ID:
        return (
          <ComboboxFormItem
            label={param.name}
            description={param.description}
            // TODO: find solution to remove `any`
            {...(adapter as any)}
          />
        );
      case FeaturerParamType.UUID_SET_TWINS_USER_GROUP_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_STATUS_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_ID:
      case FeaturerParamType.UUID_SET_TWINS_TWIN_CLASS_FIELD_ID:
      case FeaturerParamType.WORD_LIST_TWINS_TWIN_BASIC_FIELD:
        return (
          <ComboboxFormItem
            label={param.name}
            description={param.description}
            // TODO: find solution to remove `any`
            {...(adapter as any)}
            multi={true}
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
            description={param.description}
          />
        );
      case FeaturerParamType.UUID_TWINS_TWIN_CLASS_SCHEMA_ID:
      case FeaturerParamType.UUID_TWINS_LINK_ID:
      case FeaturerParamType.UUID_SET_TWINS_LINK_ID:
        return (
          <Button variant="destructive" className="block" disabled>
            Blocked
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
        return (
          <TextFormItem
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label={param.name}
            description={param.description}
          />
        );
    }
  }

  return renderParamFieldByType();
}
