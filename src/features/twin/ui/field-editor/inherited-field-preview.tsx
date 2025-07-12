"use client";

import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";
import {
  formatIntlDate,
  isPopulatedString,
  mapPatternToInputType,
} from "@/shared/libs";
import { AnchorWithCopy, MaskedValue, Switch } from "@/shared/ui";

import { DatalistOptionResourceLink } from "../../../../features/datalist-option/ui";
import { MarkdownPreview } from "../../../../features/markdown";
import { TwinResourceLink } from "../../../../features/twin/ui";
import { UserResourceLink } from "../../../../features/user/ui";
import { FieldProps } from "./types";

type Props = {
  field: FieldProps;
  relatedObjects?: RelatedObjects;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export function InheritedFieldPreview({
  field,
  relatedObjects,
  disabled = false,
  onChange,
}: Props) {
  const { descriptor, value } = field;
  const type = descriptor?.fieldType;

  switch (type) {
    case "urlV1":
      return (
        <AnchorWithCopy href={value} target="_blank">
          {value}
        </AnchorWithCopy>
      );

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
      const data = relatedObjects?.dataListsOptionMap?.[value];
      return (
        data && (
          <DatalistOptionResourceLink
            data={data}
            withTooltip
            disabled={disabled}
          />
        )
      );
    }

    case "selectLinkV1":
    case "selectLinkLongV1": {
      const data = relatedObjects?.twinMap?.[value];
      return (
        data && <TwinResourceLink data={data} withTooltip disabled={disabled} />
      );
    }

    case "selectUserV1":
    case "selectUserLongV1": {
      const data = relatedObjects?.userMap?.[value] as User | undefined;
      return (
        data && <UserResourceLink data={data} withTooltip disabled={disabled} />
      );
    }

    case "booleanV1": {
      const checked = value === "true";
      return (
        <Switch
          checked={checked}
          onCheckedChange={(v) => onChange?.(String(v))}
          disabled={disabled}
        />
      );
    }
  }

  return <p>{value}</p>;
}
