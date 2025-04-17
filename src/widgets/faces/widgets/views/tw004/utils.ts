import { getAuthHeaders } from "@/entities/face";
import { TwinClassField } from "@/entities/twin-class-field";
import { Twin } from "@/entities/twin/server";
import { RelatedObjects, TwinsAPI } from "@/shared/api";
import { isTruthy } from "@/shared/libs";

import { STATIC_FIELD_MAP } from "./constants";

type TwinFieldEditorInfo = {
  key: string;
  value: string;
  descriptor: TwinClassField["descriptor"];
  editable: boolean;
  twin: Twin;
  relatedObjects: RelatedObjects;
  resourceLinkKey: string;
};

export async function loadTwinFieldInfo(
  twinId: string,
  fieldId: string
): Promise<TwinFieldEditorInfo> {
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

  const twin = data.twin;
  const relatedObjects = data.relatedObjects as RelatedObjects;

  // Handle static system fields
  const staticField = STATIC_FIELD_MAP[fieldId];
  const editable = staticField?.editable ?? true;
  const resourceLinkKey = staticField?.resourceLinkKey;

  if (isTruthy(staticField)) {
    const { fieldName, fieldDescriptor } = staticField;
    const value = (twin[fieldName as keyof Twin] as string) ?? "";
    return {
      key: fieldName,
      value,
      descriptor: fieldDescriptor,
      editable: editable,
      twin,
      relatedObjects,
      resourceLinkKey: resourceLinkKey!,
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
    key: inheritedKey,
    value,
    descriptor: twinClassField?.descriptor,
    editable: editable,
    twin,
    relatedObjects,
    resourceLinkKey: resourceLinkKey!,
  };
}
