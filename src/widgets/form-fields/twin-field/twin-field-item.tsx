import React, { ChangeEvent } from "react";

import {
  AttachmentImageFormItem,
  CheckboxFormItem,
  ColorPickerFormItem,
  ComboboxFormItem,
  FormItemProps,
  SecretTextFormItem,
  SwitchFormItem,
  TextFormItem,
} from "@/components/form-fields";

import {
  DataListOptionV3,
  useDatalistOptionSelectAdapter,
} from "@/entities/datalist-option";
import { useTwinSelectAdapter } from "@/entities/twin";
import { Twin } from "@/entities/twin/server";
import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { DomainUser_DETAILED, useUserSelectAdapter } from "@/entities/user";
import { isPopulatedArray, mapPatternToInputType } from "@/shared/libs";

import {
  TwinFieldSelectLinkLongFormItem,
  TwinFieldTextFormItem,
} from "./components";

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

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("foobar input-change", event);
    return onChange?.(event.target.value);
  }

  function handleOnDateChange(
    event: ChangeEvent<HTMLInputElement>,
    pattern?: string
  ) {
    const newValue = formatDate(new Date(event.target.value), pattern);
    return onChange?.(newValue);
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
      case TwinFieldType.secretV1:
        return (
          <SecretTextFormItem
            {...props}
            type="password"
            onChange={handleInputChange}
          />
        );
      case TwinFieldType.textV1:
        return (
          <TwinFieldTextFormItem
            descriptor={descriptor}
            onChange={handleInputChange}
            {...props}
          />
        );
      case TwinFieldType.urlV1:
        return (
          <TextFormItem type="url" onChange={handleInputChange} {...props} />
        );
      case TwinFieldType.numericFieldV1:
        return (
          <TextFormItem type="number" onChange={handleInputChange} {...props} />
        );
      case TwinFieldType.colorHexV1:
        return <ColorPickerFormItem onChange={onChange} {...props} />;
      case TwinFieldType.dateScrollV1: {
        const type = mapPatternToInputType(descriptor.pattern!);
        return (
          <TextFormItem
            {...props}
            onChange={(event) => handleOnDateChange(event, descriptor.pattern)}
            type={type}
          />
        );
      }
      case TwinFieldType.immutableV1:
        return <TextFormItem disabled {...props} />;
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
        return (
          <TwinFieldSelectLinkLongFormItem
            linkId={descriptor.linkId!}
            multi={Boolean(descriptor.multiple)}
            twinId={twinId}
            twinClassId={twinClassId}
            onChange={onChange}
            {...props}
          />
        );
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
                dataListIdList: descriptor.dataListId
                  ? [descriptor.dataListId]
                  : [],
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
      case TwinFieldType.attachmentFieldV1:
        return (
          <AttachmentImageFormItem
            {...props}
            fieldValue={props.fieldValue}
            onChange={onChange}
          />
        );

      case TwinFieldType.booleanV1:
        const checked = props.fieldValue === "true";

        if (descriptor?.checkboxType === "TOGGLE") {
          return (
            <SwitchFormItem
              {...props}
              fieldValue={checked}
              onChange={(v) => onChange?.(String(v))}
            />
          );
        }

        return (
          <CheckboxFormItem
            {...props}
            fieldValue={checked}
            onChange={(v) => onChange?.(String(v))}
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

// NOTE: formatDate currently handles only the ISO-like pattern "yyyy-MM-dd'T'HH:mm:ss" and otherwise falls back to date.toDateString().
//
// TODO: Evaluate replacing this with
// Intl.DateTimeFormat or a lightweight library (date-fns, Day.js, Luxon)
// to gain locale/time-zone support, better formatting options, and potentially smaller bundle size.
function formatDate(date: Date, pattern?: string): string {
  if (pattern === "yyyy-MM-dd'T'HH:mm:ss") {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  return date.toDateString();
}
