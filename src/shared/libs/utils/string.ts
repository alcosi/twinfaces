import { isPopulatedString } from "../types";

export function wrapWithPercent(input: string): string {
  return `%${input}%`;
}

export function mergeUniqueStrings(
  existing: string[],
  incoming: string[]
): string[] {
  const existingSet = new Set(existing);
  const uniqueIncoming = incoming.filter((item) => !existingSet.has(item));
  return [...existing, ...uniqueIncoming];
}

export function capitalize(value: string): string {
  if (!isPopulatedString(value)) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function slugify(input?: string): string {
  if (!input) return "";
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}
