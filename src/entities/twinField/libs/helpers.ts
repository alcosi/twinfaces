import { RelatedObjects } from "@/shared/api";
import { isArray, isObject, isPopulatedString, isTruthy } from "@/shared/libs";

import { TwinFieldType, TwinFieldUI, TwinFieldValueObject } from "./types";

/**
 * Values of `multiple` fields arrive as a single comma-separated string of ids,
 * so any field value can hold more than one id.
 */
const splitTwinFieldValue = (value: string): string[] =>
  value
    .split(",")
    .map((id) => id.trim())
    .filter(isPopulatedString);

/** Turns a resolved value back into the comma-separated wire format. */
export function stringifyTwinFieldValue(value: TwinFieldUI["value"]): string {
  if (isArray<TwinFieldValueObject>(value)) {
    return value
      .map((item) => item.id)
      .filter(isPopulatedString)
      .join(",");
  }

  return isObject<TwinFieldValueObject>(value) ? (value.id ?? "") : value;
}

/**
 * A field is editable unless the server explicitly says otherwise, so responses
 * that omit the flag keep the previous (always-editable) behaviour.
 */
export function isTwinFieldEditable(field: TwinFieldUI): boolean {
  return field.editable !== false;
}

/** The label a field is shown and sorted by, mirroring its resource link. */
export function getTwinFieldDisplayName(field: TwinFieldUI): string {
  return isPopulatedString(field.name) ? field.name : field.key;
}

/** Every object a resolved value holds, single- and multi-value alike. */
export function toTwinFieldValueList<T extends TwinFieldValueObject>(
  value: TwinFieldUI["value"]
): T[] {
  const items = isArray<TwinFieldValueObject>(value) ? value : [value];

  return items.filter(
    (item): item is T =>
      isObject<TwinFieldValueObject>(item) && isTruthy(item.id)
  );
}

/**
 * Resolves ids against a related-objects map. Single values keep their scalar
 * shape; multi-value ones become one object per id. Falls back to the raw
 * string when an id is missing from the map — the value stays visible instead
 * of turning into a blank.
 */
function hydrateValue<T extends TwinFieldValueObject>(
  value: string,
  map?: Record<string, T>
): string | T | T[] {
  const ids = splitTwinFieldValue(value);

  if (ids.length === 0) return value;
  if (ids.length === 1) return map?.[ids[0]!] ?? value;

  const resolved = ids.map((id) => map?.[id]).filter(isTruthy);

  return resolved.length === ids.length ? resolved : value;
}

export const hydrateTwinFieldFromMap = ({
  dto,
  relatedObjects,
}: {
  dto: [string, string];
  relatedObjects?: RelatedObjects;
}): TwinFieldUI => {
  const [key, value] = dto;

  const twinFieldKeyValue: TwinFieldUI = { key, value } as TwinFieldUI;

  if (!relatedObjects?.twinClassFieldMap) return twinFieldKeyValue;

  const twinClassField = Object.values(relatedObjects.twinClassFieldMap).find(
    (field) => field.key === key
  );

  // NOTE: To support preview state for diff `fieldType`(s)
  switch (twinClassField?.descriptor?.fieldType) {
    case TwinFieldType.selectListV1:
    case TwinFieldType.selectLongV1:
    case TwinFieldType.selectSharedInHeadV1:
      twinFieldKeyValue.value = hydrateValue(
        value,
        relatedObjects?.dataListsOptionMap
      );
      break;

    case TwinFieldType.selectUserV1:
    case TwinFieldType.selectUserLongV1:
      twinFieldKeyValue.value = hydrateValue(value, relatedObjects?.userMap);
      break;

    case TwinFieldType.selectLinkV1:
    case TwinFieldType.selectLinkLongV1:
      twinFieldKeyValue.value = hydrateValue(value, relatedObjects?.twinMap);
      break;
  }

  return { ...twinFieldKeyValue, ...twinClassField };
};
