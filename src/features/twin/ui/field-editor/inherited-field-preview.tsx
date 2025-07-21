"use client";

import Image from "next/image";

import { CheckboxFormItem, SwitchFormItem } from "@/components/form-fields";

import { TwinFieldUI } from "@/entities/twinField";
import {
  formatIntlDate,
  isObject,
  isPopulatedString,
  isTruthy,
  mapPatternToInputType,
} from "@/shared/libs";
import { AnchorWithCopy, MaskedValue } from "@/shared/ui";

import { DatalistOptionResourceLink } from "../../../../features/datalist-option/ui";
import { MarkdownPreview } from "../../../../features/markdown";
import { TwinResourceLink } from "../../../../features/twin/ui";
import { UserResourceLink } from "../../../../features/user/ui";

type Props = {
  field: TwinFieldUI;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export function InheritedFieldPreview({
  field,
  disabled = false,
  onChange,
}: Props) {
  const { descriptor, value, name } = field;
  const type = descriptor?.fieldType;

  switch (type) {
    case "urlV1":
      // TODO: not-pretty. refactor
      if (isPopulatedString(value)) {
        return (
          <AnchorWithCopy href={value} target="_blank">
            {value}
          </AnchorWithCopy>
        );
      }

    case "secretV1":
      return <MaskedValue value={value} />;

    case "textV1":
      if (
        descriptor &&
        ["MARKDOWN_BASIC", "MARKDOWN_GITHUB"].includes(
          `${descriptor.editorType}`
        )
      ) {
        return <MarkdownPreview source={value} />;
      }
      break;

    case "dateScrollV1": {
      const format = isPopulatedString(descriptor?.pattern)
        ? mapPatternToInputType(descriptor.pattern)
        : "text";
      return isPopulatedString(value) ? formatIntlDate(value, format) : null;
    }

    case "selectListV1":
    case "selectLongV1":
    case "selectSharedInHeadV1": {
      // NOTE: типо это `DataListOptionV3`
      if (isObject(value) && isTruthy(value.id)) {
        return (
          <DatalistOptionResourceLink
            data={value}
            withTooltip
            disabled={disabled}
          />
        );
      }
    }

    case "selectLinkV1":
    case "selectLinkLongV1": {
      if (!value) return null;

      const data = relatedObjects?.twinMap?.[value] ?? {
        id: value,
        name,
      };

      return <TwinResourceLink data={data} withTooltip disabled={disabled} />;

      //       const data = relatedObjects?.twinMap?.[value];

      // return (
      //   data && <TwinResourceLink data={data} withTooltip disabled={disabled} />
      // );
    }

    case "selectUserV1":
    case "selectUserLongV1": {
      const data = relatedObjects?.userMap?.[value];

      return (
        data && <UserResourceLink data={data} withTooltip disabled={disabled} />
      );
    }

    case "attachmentFieldV1": {
      const url = value as string | undefined;

      return isPopulatedString(url) ? (
        <div className="flex flex-wrap gap-2">
          <Image
            src={url}
            alt="Attachment"
            width={48}
            height={48}
            className="rounded border object-cover"
          />
        </div>
      ) : null;
    }

    case "booleanV1": {
      const checked = value === "true";

      if (descriptor?.checkboxType === "TOGGLE") {
        return (
          <SwitchFormItem
            fieldValue={checked}
            onChange={(v) => onChange?.(String(v))}
            disabled={disabled}
          />
        );
      }

      return (
        <CheckboxFormItem
          fieldValue={checked}
          onChange={(v) => onChange?.(String(v))}
          disabled={disabled}
        />
      );
    }
  }

  return <p>{value}</p>;
}
