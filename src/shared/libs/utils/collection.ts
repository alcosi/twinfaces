export const toArray = <T>(value: T | T[] | undefined | null): T[] => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

// Warning: temp solution
// TODO: Find better solution
export const toArrayOfString = <T>(input: unknown, key?: keyof T): string[] => {
  // Check if the input is an array
  if (!Array.isArray(input)) {
    return [];
  }

  // Check if every item in the array is a string
  if (input.every((item) => typeof item === "string")) {
    return input as string[];
  }

  // Handle arrays of objects with the specified key
  return (input as T[])
    .map((item) => {
      const hasValidKey = item && typeof item === "object" && key && item[key];
      const value = hasValidKey ? String(item[key]) : "";
      return value;
    })
    .filter((value) => value !== "");
};

export function mergeUniqueItems<T extends { id: string | number }>(
  existing: T[],
  incoming: T[]
): T[] {
  const existingIds = new Set(existing.map((item) => item.id));
  const uniqueIncoming = incoming.filter((item) => !existingIds.has(item.id));
  return [...existing, ...uniqueIncoming];
}

export function extractEnabledFilters<K extends string, V>(
  enabledFilters: K[],
  allFilters: Record<K, V>
): Record<K, V> {
  return enabledFilters.reduce(
    (filters, key) => {
      filters[key] = allFilters[key];
      return filters;
    },
    {} as Record<K, V>
  );
}

export function pluckProperty<
  T extends Record<string, Record<K, unknown>>,
  K extends keyof T[string],
>(obj: T, prop: K): Record<keyof T, T[string][K]> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, nestedObj]) => [key, nestedObj[prop]])
  ) as Record<keyof T, T[string][K]>;
}

export function isFound<T>(
  array: T[],
  predicate: (item: T) => boolean
): boolean {
  return array.findIndex(predicate) !== -1;
}
