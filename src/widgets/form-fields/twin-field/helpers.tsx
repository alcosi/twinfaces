import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { TwinResourceLink } from "@/entities/twin";
import { z, ZodType } from "zod";
import {
  DatalistOptionResourceLink,
  DataListOptionV3,
} from "@/entities/datalist-option";
import { User, UserResourceLink } from "@/entities/user";

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
    case TwinFieldType.selectListLongV1:
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

    default:
      return twinField.value as string;
  }
}
