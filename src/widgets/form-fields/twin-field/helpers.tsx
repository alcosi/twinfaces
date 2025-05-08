import { ZodType, z } from "zod";

import { DataListOptionV3 } from "@/entities/datalist-option";
import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { MarkdownPreview } from "@/features/markdown";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";

export function resolveTwinFieldSchema(
  twinField: TwinFieldUI
): ZodType<string> | undefined {
  switch (twinField.descriptor.fieldType) {
    case TwinFieldType.urlV1:
      return z.string().url();
    default:
      return undefined;
  }
}

export function renderTwinFieldPreview(twinField: TwinFieldUI) {
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
        />
      );

    case TwinFieldType.selectListV1:
    case TwinFieldType.selectSharedInHeadV1:
      return (
        <DatalistOptionResourceLink
          data={twinField.value as DataListOptionV3}
          withTooltip
        />
      );

    case TwinFieldType.selectUserV1:
    case TwinFieldType.selectUserLongV1:
      return <UserResourceLink data={{ id: twinField.value as string }} />;

    case TwinFieldType.textV1:
      switch (twinField.descriptor.editorType) {
        case "MARKDOWN_GITHUB":
        case "MARKDOWN_BASIC":
          return <MarkdownPreview markdown={twinField.value as string} />;
        default:
          return twinField.value as string;
      }
    default:
      return twinField.value as string;
  }
}
