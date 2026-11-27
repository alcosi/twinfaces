import { getAuthHeaders } from "@/entities/face";
import { TwinSelfFieldId } from "@/entities/twin";
import { Twin } from "@/entities/twin/server";
import { hydrateTwinFieldFromMap } from "@/entities/twinField";
import { User } from "@/entities/user";
import { apiFromRequest } from "@/entities/user/server";
import { TwinFieldEditorProps } from "@/features/twin/ui";
import { SELF_FIELD_MAP } from "@/features/twin/ui/field-editor/constants";
import { RelatedObjects, Result } from "@/shared/api";
import { errorToResult, isBoolean, isTruthy } from "@/shared/libs";

type FieldEditorData = Pick<
  TwinFieldEditorProps,
  "twin" | "field" | "relatedObjects"
>;

export async function buildFieldEditorProps(
  twinId: string,
  fieldId: string
): Promise<Result<FieldEditorData>> {
  const twinResult = await fetchFieldEditorTwin(twinId);
  if (!twinResult.ok) return twinResult;

  const { twin, relatedObjects } = twinResult.data;
  return resolveEditorField({ twin, relatedObjects, fieldId });
}

/**
 * Loads a twin with everything its field editors need (field values, class
 * fields with descriptors, and the objects select values point to). One call
 * serves any number of fields of that twin.
 */
export async function fetchFieldEditorTwin(
  twinId: string
): Promise<Result<Omit<FieldEditorData, "field">>> {
  const header = await getAuthHeaders();
  const api = await apiFromRequest();

  try {
    const { data, error } = await api.GET("/private/twin/{twinId}/v2", {
      params: {
        header,
        path: { twinId },
        query: {
          lazyRelation: false,
          // NOTE: for static-key variant
          showTwinMode: "DETAILED",
          // NOTE: for dynamic-key variant
          showTwinFieldCollectionMode: "SHOW",
          showTwinFieldCollectionFilterEmptyMode: "ANY",
          showTwin2TwinClassMode: "SHORT",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinClassFieldCollectionMode: "SHOW",
          showTwin2UserMode: "DETAILED",
          showTwin2StatusMode: "DETAILED",
          showTwinByHeadMode: "YELLOW",
          showTwinField2DataListOptionMode: "DETAILED",
          // Users referenced by user fields (single and multiple).
          showTwinField2UserMode: "DETAILED",
          showTwinTag2DataListOptionMode: "DETAILED",
          showTwin2TransitionMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
          showTwin2TwinLinkMode: "SHORT",
        },
      },
    });

    if (error || !data?.twin) {
      return errorToResult(new Error("Failed to load twin data."));
    }

    return {
      ok: true,
      data: {
        twin: data.twin as Twin & { ownerUser?: User },
        relatedObjects: data.relatedObjects as RelatedObjects,
      },
    };
  } catch (error) {
    return errorToResult(error);
  }
}

/** Builds the editor field of `fieldId` from an already loaded twin. */
export function resolveEditorField({
  twin,
  relatedObjects,
  fieldId,
}: Omit<FieldEditorData, "field"> & {
  fieldId: string;
}): Result<FieldEditorData> {
  // Handle twin's system fields
  const selfField = SELF_FIELD_MAP[fieldId as TwinSelfFieldId];

  if (isTruthy(selfField)) {
    const { key, descriptor } = selfField;
    const value = (twin[key as keyof Twin] as string) ?? "";
    return {
      ok: true,
      data: {
        twin,
        relatedObjects,
        field: {
          id: fieldId,
          key,
          value,
          descriptor,
          editable: findFieldEditable(twin, key),
        },
      },
    };
  }

  // Handle inherited from twin-class twin-fields
  const twinClassField = relatedObjects?.twinClassFieldMap?.[fieldId];
  const inheritedKey = twinClassField?.key;

  if (!inheritedKey) {
    return errorToResult(
      new Error("Failed to retrieve dynamic field key or value.")
    );
  }

  const value = twin.fields?.[inheritedKey] ?? "";

  try {
    const hydratedField = hydrateTwinFieldFromMap({
      dto: [inheritedKey, value],
      relatedObjects,
    });

    const editable = findFieldEditable(twin, inheritedKey);
    if (isBoolean(editable)) hydratedField.editable = editable;

    return {
      ok: true,
      data: { twin, relatedObjects, field: hydratedField },
    };
  } catch (error) {
    return errorToResult(error);
  }
}

/** Per-twin editability of a field, as the twin's `fieldsMap` reports it. */
function findFieldEditable(twin: Twin, key: string): boolean | undefined {
  return Object.values(twin.fieldsMap ?? {}).find((entry) => entry.key === key)
    ?.editable;
}
