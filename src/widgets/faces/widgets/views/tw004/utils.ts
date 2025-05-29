import { getAuthHeaders } from "@/entities/face";
import { StaticTwinFieldId } from "@/entities/twin";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { TwinFieldEditorProps } from "@/features/twin/ui";
import { STATIC_FIELD_MAP } from "@/features/twin/ui/field-editor/constants";
import { RelatedObjects, TwinsAPI } from "@/shared/api";
import { isTruthy } from "@/shared/libs";

export async function buildFieldEditorProps(
  twinId: string,
  fieldId: string
): Promise<Pick<TwinFieldEditorProps, "twin" | "field" | "relatedObjects">> {
  const header = await getAuthHeaders();
  const { data, error } = await TwinsAPI.GET("/private/twin/{twinId}/v2", {
    params: {
      header,
      path: { twinId },
      query: {
        lazyRelation: false,
        // NOTE: for static-key variant
        showTwinMode: "DETAILED",
        // NOTE: for dynamic-key variant
        showTwinFieldCollectionMode: "ALL_FIELDS",
        showTwin2TwinClassMode: "SHORT",
        showTwinClass2TwinClassFieldMode: "DETAILED",
        showTwin2UserMode: "DETAILED",
        showTwin2StatusMode: "DETAILED",
        showTwinByHeadMode: "YELLOW",
        showTwinField2DataListOptionMode: "DETAILED",
        showTwinTag2DataListOptionMode: "DETAILED",
        showTwin2TransitionMode: "DETAILED",
      },
    },
  });

  if (error || !data?.twin) {
    throw new Error("Failed to load twin data.");
  }

  const twin = data.twin as Twin & { ownerUser?: User };
  const relatedObjects = data.relatedObjects as RelatedObjects;

  // Handle static system fields
  const staticField = STATIC_FIELD_MAP[fieldId as StaticTwinFieldId];

  if (isTruthy(staticField)) {
    const { key, descriptor } = staticField;
    const value = (twin[key as keyof Twin] as string) ?? "";
    return {
      twin,
      relatedObjects,
      field: {
        id: fieldId,
        key,
        value,
        descriptor,
      },
    };
  }

  // Handle dynamic twin class fields
  const twinClassField = data.relatedObjects?.twinClassFieldMap?.[fieldId];
  const inheritedKey = twinClassField?.key;
  const value = data.twin.fields?.[inheritedKey!] ?? "";

  if (!inheritedKey) {
    throw new Error("Failed to retrieve dynamic field key or value.");
  }

  return {
    twin,
    relatedObjects,
    field: {
      id: fieldId,
      key: inheritedKey,
      value,
      descriptor: twinClassField?.descriptor,
    },
  };
}
