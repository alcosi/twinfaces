import { ZodType, z } from "zod";

import { DataListOptionV3 } from "@/entities/datalist-option";
import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { MarkdownPreview } from "@/features/markdown";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import {
  formatIntlDate,
  isPopulatedString,
  mapPatternToInputType,
} from "@/shared/libs";
import { MaskedValue } from "@/shared/ui";

export function resolveTwinFieldSchema(
  twinField: TwinFieldUI
): ZodType<string> | undefined {
  switch (twinField.descriptor.fieldType) {
    case TwinFieldType.urlV1:
      return z.string().url();
    case TwinFieldType.secretV1:
      return z.string().regex(/^\S*$/, {
        message: "Value must not contain spaces",
      });
    default:
      return undefined;
  }
}

export function renderTwinFieldPreview({
  twinField,
  allowNavigation,
}: {
  twinField: TwinFieldUI;
  allowNavigation: boolean;
}) {
  switch (twinField.descriptor.fieldType) {
    case TwinFieldType.selectLinkV1:
    case TwinFieldType.selectLinkLongV1:
      return (
        <TwinResourceLink
          data={{
            id: twinField.value as string,
            name: twinField.name,
            description: twinField.description,
          }}
          withTooltip
          disabled={!allowNavigation}
        />
      );

    case TwinFieldType.selectListV1:
    case TwinFieldType.selectLongV1:
    case TwinFieldType.selectSharedInHeadV1:
      return (
        <DatalistOptionResourceLink
          data={twinField.value as DataListOptionV3}
          withTooltip
          disabled={!allowNavigation}
        />
      );
    case TwinFieldType.dateScrollV1: {
      const inputFormatType = mapPatternToInputType(
        twinField.descriptor.pattern!
      );

      return isPopulatedString(twinField.value)
        ? formatIntlDate(twinField.value as string, inputFormatType)
        : "";
    }
    case TwinFieldType.selectUserV1:
    case TwinFieldType.selectUserLongV1:
      return (
        <UserResourceLink
          data={{ id: twinField.value as string }}
          disabled={!allowNavigation}
        />
      );

    case TwinFieldType.textV1:
      switch (twinField.descriptor.editorType) {
        case "MARKDOWN_GITHUB":
        case "MARKDOWN_BASIC":
          return <MarkdownPreview source={twinField.value as string} />;
        default:
          return twinField.value as string;
      }
    case TwinFieldType.secretV1:
      return <MaskedValue value={String(twinField.value)} />;
    default:
      return twinField.value as string;
  }
}
