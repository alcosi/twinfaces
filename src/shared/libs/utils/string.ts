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

export function truncateStr(
  value: string,
  format?: "short" | "middle" | "long"
): string {
  if (!isPopulatedString(value)) return value;

  switch (format) {
    case "short":
      if (value.length >= 8) {
        return `${value.slice(0, 8)}...${value.slice(-2)}`;
      }
      break;
    case "middle":
      if (value.length >= 50) {
        return `${value.slice(0, 30)}...${value.slice(-10)}`;
      }
      break;
    case "long":
    default:
      return value;
  }

  return value;
}
