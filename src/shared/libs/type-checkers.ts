export function isEmptyString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length === 0;
}

export function isPopulatedString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}

export function isEmptyArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length === 0;
}

export function isPopulatedArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}
