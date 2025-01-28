import {
  ColorPickerFormItem,
  FormItemProps,
  TextFormItem,
} from "@/components/form-fields";
import { ComboboxFormItem } from "@/components/form-fields/combobox";
import {
  DataListOptionV3,
  useDatalistOptionSelectAdapter,
} from "@/entities/datalist-option";
import { Twin, useTwinSelectAdapter } from "@/entities/twin";
import { TwinClassFieldDescriptor } from "@/entities/twinClassField";
import { TwinFieldType } from "@/entities/twinField";
import { isPopulatedArray } from "@/shared/libs";
import React from "react";

export type TwinFieldFormItemProps = {
  descriptor: TwinClassFieldDescriptor;
};

type Props = FormItemProps &
  TwinFieldFormItemProps & {
    fieldValue: string;
    onChange?: (value: string) => void;
  };

export function TwinFieldFormItem({ descriptor, onChange, ...props }: Props) {
  const twinAdapter = useTwinSelectAdapter();
  const optionAdapter = useDatalistOptionSelectAdapter();

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    return onChange?.(event.target.value);
  }

  function handleOnTwinSelect(twins?: Twin[]) {
    if (isPopulatedArray<Twin>(twins)) {
      return onChange?.(twins[0].id!);
    }
  }

  function handleOnDataListSelect(datalistOptions?: DataListOptionV3[]) {
    if (isPopulatedArray<DataListOptionV3>(datalistOptions)) {
      return onChange?.(datalistOptions[0].id!);
    }
  }

  function renderByType() {
    switch (descriptor.fieldType) {
      case TwinFieldType.textV1:
        return <TextFormItem onChange={handleTextChange} {...props} />;
      case TwinFieldType.urlV1:
        return (
          <TextFormItem type="url" onChange={handleTextChange} {...props} />
        );
      case TwinFieldType.numericV1:
      case TwinFieldType.numericFieldV1:
        return (
          <TextFormItem type="number" onChange={handleTextChange} {...props} />
        );
      case TwinFieldType.colorHexV1:
        return <ColorPickerFormItem onChange={onChange} {...props} />;
      case TwinFieldType.dateScrollV1:
        return (
          <TextFormItem type="date" onChange={handleTextChange} {...props} />
        );
      case TwinFieldType.immutableV1:
        return <TextFormItem disabled {...props} />;
      case TwinFieldType.attachmentFieldV1:
      case TwinFieldType.attachmentV1:
        return (
          <TextFormItem type="file" onChange={handleTextChange} {...props} />
        );
      case TwinFieldType.selectLinkV1:
      case TwinFieldType.selectLinkLongV1:
        return (
          <ComboboxFormItem
            getById={twinAdapter.getById}
            getItems={(search) => twinAdapter.getItems(search)}
            renderItem={twinAdapter.renderItem}
            onSelect={handleOnTwinSelect}
            {...props}
          />
        );
      case TwinFieldType.selectListV1:
      case TwinFieldType.selectListLongV1:
      case TwinFieldType.selectLongV1:
        return (
          <ComboboxFormItem
            getById={optionAdapter.getById}
            getItems={(search) =>
              optionAdapter.getItems(search, {
                idList: descriptor.optionIdList ?? [],
              })
            }
            renderItem={optionAdapter.renderItem}
            onSelect={handleOnDataListSelect}
            {...props}
          />
        );
      case TwinFieldType.selectSharedInHeadV1:
      case TwinFieldType.selectUserV1:
      case TwinFieldType.selectUserLongV1:
        return (
          <TextFormItem
            onChange={handleTextChange}
            {...props}
            fieldValue="not implemented"
            disabled
            className="text-destructive"
          />
        );
      default:
        return (
          <TextFormItem
            className="text-destructive"
            value="This field type is not supported!"
            disabled
            {...props}
          />
        );
    }
  }

  return renderByType();
}
