import { isBoolean, isPopulatedString } from "../types";

export const mapToChoice = (input: unknown): "ONLY" | "ONLY_NOT" | "ANY" => {
  if (input === "indeterminate" || input === undefined) return "ANY";

  if (isBoolean(input)) {
    return input ? "ONLY" : "ONLY_NOT";
  }

  return "ANY";
};

export function reduceToObject<T, V>({
  list,
  key = "id" as keyof T,
  defaultValue = null as V,
}: {
  list: T[];
  key?: keyof T;
  defaultValue?: V;
}) {
  return list.reduce<Record<string, V>>((acc, item) => {
    const fieldValue = isPopulatedString(item) ? item : item[key];
    if (isPopulatedString(fieldValue)) {
      acc[fieldValue] = defaultValue;
    }
    return acc;
  }, {});
}

export function invertMap<Key extends string, Value extends string>(
  map: Record<Key, Value>
): Record<Value, Key> {
  return Object.fromEntries(
    Object.entries(map).map(([k, v]) => [v, k])
  ) as Record<Value, Key>;
}
