import {
  CheckboxFormItem,
  ComboboxFormItem,
  TagsFormItem,
  TextFormItem,
} from "@/components/form-fields";
import {
  FeaturerParam,
  FeaturerParamType,
  FeaturerParamValue,
} from "@/entities/featurer";
import { isPopulatedArray } from "@/shared/libs";
import { Button } from "@/shared/ui";
import { useFeaturerParamTypesSelectAdapter } from "./hooks";

interface FeaturerParamInputProps {
  param: FeaturerParam;
  value: FeaturerParamValue;
  onChange: (key: string, value: FeaturerParamValue) => void;
}

export function FeaturerParamInput({
  param,
  value,
  onChange,
}: FeaturerParamInputProps) {
  const adapter = useFeaturerParamTypesSelectAdapter(
    param.type as FeaturerParamType
  );

  function setValue(newValue: FeaturerParamValue) {
    onChange(param.key!, newValue);
  }

  function renderParamFieldByType() {
    switch (param.type) {
      case FeaturerParamType.BOOLEAN:
        return (
          <CheckboxFormItem
            label={param.name}
            description={param.description}
            fieldValue={Boolean(value)}
            onChange={(newChecked) => setValue(Boolean(newChecked))}
          />
        );
      case FeaturerParamType.WORD_LIST:
        return (
          <TagsFormItem
            label={param.name}
            description={param.description}
            value={value as string}
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
      case FeaturerParamType.UUID_TWINS_LINK_ID:
        return (
          <ComboboxFormItem
            label={param.name}
            description={param.description}
            // TODO: find solution to remove `any`
            {...(adapter as any)}
            onSelect={(item: [{ id: string }, ...{ id: string }[]]) => {
              setValue(isPopulatedArray(item) ? item[0].id : item);
            }}
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
            label={param.name}
            description={param.description}
            // TODO: find solution to remove `any`
            {...(adapter as any)}
            multi={true}
            onSelect={(items: [{ id: string }, ...{ id: string }[]]) => {
              const ids = items.map((item) => item.id).join(",");
              setValue(ids);
            }}
          />
        );
      case FeaturerParamType.INT:
      case FeaturerParamType.DOUBLE:
        return (
          <TextFormItem
            type="number"
            value={Number(value)}
            onChange={(e) => setValue(Number(e.target.value))}
            label={param.name}
            description={param.description}
          />
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
        return (
          <TextFormItem
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            label={param.name}
            description={param.description}
          />
        );
    }
  }

  return renderParamFieldByType();
}
