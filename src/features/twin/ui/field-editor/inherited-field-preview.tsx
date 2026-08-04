"use client";

import Image from "next/image";
import { ReactNode } from "react";

import { CheckboxFormItem, SwitchFormItem } from "@/components/form-fields";

import { DataListOptionV1 } from "@/entities/datalist-option";
import { Twin } from "@/entities/twin/server";
import { TwinFieldUI, toTwinFieldValueList } from "@/entities/twinField";
import { User } from "@/entities/user";
import {
  formatIntlDate,
  isPopulatedArray,
  isPopulatedString,
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
  editable?: boolean;
  onChange?: (value: string) => void;
};

export function InheritedFieldPreview({
  field,
  disabled = false,
  editable = true,
  onChange,
}: Props) {
  const { descriptor, value } = field;
  const type = descriptor?.fieldType;

  switch (type) {
    case "urlV1": {
      if (isPopulatedString(value)) {
        return (
          <AnchorWithCopy href={value} target="_blank">
            {value}
          </AnchorWithCopy>
        );
      }
      break;
    }

    case "secretV1": {
      if (isPopulatedString(value)) {
        return <MaskedValue value={value} />;
      }
      break;
    }

    case "textV1": {
      if (
        descriptor &&
        ["MARKDOWN_BASIC", "MARKDOWN_GITHUB"].includes(
          `${descriptor.editorType}`
        )
      ) {
        if (isPopulatedString(value)) {
          return <MarkdownPreview source={value} />;
        }
      }
      break;
    }

    case "dateScrollV1": {
      const format = isPopulatedString(descriptor?.pattern)
        ? mapPatternToInputType(descriptor.pattern)
        : "text";
      return isPopulatedString(value) ? formatIntlDate(value, format) : null;
    }

    case "selectListV1":
    case "selectLongV1":
    case "selectSharedInHeadV1": {
      const options = toTwinFieldValueList<DataListOptionV1>(value);

      if (isPopulatedArray(options)) {
        return (
          <ResourceLinkList>
            {options.map((option) => (
              <DatalistOptionResourceLink
                key={option.id}
                data={option}
                withTooltip
                disabled={disabled}
              />
            ))}
          </ResourceLinkList>
        );
      }
      break;
    }

    case "selectLinkV1":
    case "selectLinkLongV1": {
      const twins = toTwinFieldValueList<Twin>(value);

      if (isPopulatedArray(twins)) {
        return (
          <ResourceLinkList>
            {twins.map((twin) => (
              <TwinResourceLink
                key={twin.id}
                data={twin}
                withTooltip
                disabled={disabled}
              />
            ))}
          </ResourceLinkList>
        );
      }
      break;
    }

    case "selectUserV1":
    case "selectUserLongV1": {
      const users = toTwinFieldValueList<User>(value);

      if (isPopulatedArray(users)) {
        return (
          <ResourceLinkList>
            {users.map((user) => (
              <UserResourceLink
                key={user.id}
                data={user}
                withTooltip
                disabled={disabled}
              />
            ))}
          </ResourceLinkList>
        );
      }
      break;
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
            disabled={!editable}
          />
        );
      }

      return (
        <CheckboxFormItem
          fieldValue={checked}
          onChange={(v) => onChange?.(String(v))}
          disabled={!editable}
        />
      );
    }
  }

  return <p className="max-w-full overflow-hidden">{`${value}`}</p>;
}

/** Keeps a `multiple` field's links on one wrapping row. */
function ResourceLinkList({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-1">
      {children}
    </div>
  );
}
