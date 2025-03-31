import React from "react";

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
import { useTwinSelectAdapter } from "@/entities/twin";
import { Twin } from "@/entities/twin/server";
import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { DomainUser_DETAILED, useUserSelectAdapter } from "@/entities/user";
import { isPopulatedArray } from "@/shared/libs";

import { TwinFieldSelectLinkLongFormItem } from "./components";

export type TwinFieldFormItemProps = {
  descriptor?: TwinFieldUI["descriptor"];
} & (
  | { twinClassId: string; twinId?: never }
  | { twinId: string; twinClassId?: never }
);

type Props = FormItemProps &
  TwinFieldFormItemProps & {
    fieldValue: string;
    onChange?: (value: string) => void;
  };

export function TwinFieldFormItem({
  twinId,
  twinClassId,
  descriptor,
  onChange,
  ...props
}: Props) {
  const twinAdapter = useTwinSelectAdapter();
  const optionAdapter = useDatalistOptionSelectAdapter();
  const userAdapter = useUserSelectAdapter();

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

  function handleOnUserSelect(users?: DomainUser_DETAILED[]) {
    if (isPopulatedArray<DomainUser_DETAILED>(users)) {
      return onChange?.(users[0].userId);
    }
  }

  function renderByType() {
    switch (descriptor?.fieldType) {
      case TwinFieldType.textV1:
        return <TextFormItem onChange={handleTextChange} {...props} />;
      case TwinFieldType.urlV1:
        return (
          <TextFormItem type="url" onChange={handleTextChange} {...props} />
        );
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
        return (
          <TextFormItem type="file" onChange={handleTextChange} {...props} />
        );
      case TwinFieldType.selectLinkV1:
      case TwinFieldType.selectSharedInHeadV1:
        return (
          <ComboboxFormItem
            getById={twinAdapter.getById}
            getItems={(search) => twinAdapter.getItems(search)}
            renderItem={twinAdapter.renderItem}
            onSelect={handleOnTwinSelect}
            multi={descriptor.multiple}
            {...props}
          />
        );
      case TwinFieldType.selectLinkLongV1:
        if (twinId) {
          return (
            <TwinFieldSelectLinkLongFormItem
              linkId={descriptor.linkId!}
              multi={Boolean(descriptor.multiple)}
              twinId={twinId}
              {...props}
            />
          );
        } else if (twinClassId) {
          return (
            <TwinFieldSelectLinkLongFormItem
              linkId={descriptor.linkId!}
              multi={Boolean(descriptor.multiple)}
              twinClassId={twinClassId}
              {...props}
            />
          );
        }
        break;
      case TwinFieldType.selectListV1:
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
            multi={descriptor.multiple}
            {...props}
          />
        );
      case TwinFieldType.selectLongV1:
        return (
          <ComboboxFormItem
            getById={optionAdapter.getById}
            getItems={(search) =>
              optionAdapter.getItems(search, {
                idList: descriptor.dataListId ?? [],
              })
            }
            renderItem={optionAdapter.renderItem}
            onSelect={handleOnDataListSelect}
            multi={descriptor.multiple}
            {...props}
          />
        );
      case TwinFieldType.selectUserV1:
        return (
          <ComboboxFormItem
            {...userAdapter}
            getById={userAdapter.getById}
            getItems={(search) =>
              userAdapter.getItems(search, {
                userIdList: descriptor.userIdList ?? [],
              })
            }
            renderItem={userAdapter.renderItem}
            onSelect={handleOnUserSelect}
            {...props}
          />
        );
      case TwinFieldType.selectUserLongV1:
        return (
          <ComboboxFormItem
            {...userAdapter}
            getById={userAdapter.getById}
            getItems={(search) =>
              userAdapter.getItems(search, {
                userIdList: descriptor.userFilterId ?? [],
              })
            }
            renderItem={userAdapter.renderItem}
            onSelect={handleOnUserSelect}
            {...props}
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
