import { TwinFieldType, TwinFieldUI } from "@/entities/twinField";
import { TwinResourceLink } from "@/entities/twin";
import { z, ZodType } from "zod";
import { DatalistOptionResourceLink } from "@/entities/datalist-option";

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
            id: twinField.value,
            name: twinField.name,
            description: twinField.description,
          }}
          withTooltip
        />
      );

    case TwinFieldType.selectListV1:
    case TwinFieldType.selectListLongV1:
      return <DatalistOptionResourceLink data={twinField} withTooltip />;

    default:
      return twinField.value;
  }
}
