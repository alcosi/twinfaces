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
  return value.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
}

export function slugify(input?: string): string {
  if (!input) return "";
  return input.trim().toLowerCase().replace(/\s+/g, "-");
}
