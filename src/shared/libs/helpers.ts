import React from "react";
import { isBoolean, isPopulatedString, SelectAdapter } from "./types";

export const mapToChoice = (input: unknown): "ONLY" | "ONLY_NOT" | "ANY" => {
  if (input === "indeterminate" || input === undefined) return "ANY";

  if (isBoolean(input)) {
    return input ? "ONLY" : "ONLY_NOT";
  }

  return "ANY";
};

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

export function mergeUniqueItems<T extends { id: string | number }>(
  existing: T[],
  incoming: T[]
): T[] {
  const existingIds = new Set(existing.map((item) => item.id));
  const uniqueIncoming = incoming.filter((item) => !existingIds.has(item.id));
  return [...existing, ...uniqueIncoming];
}

// Utility function to create an enum from a string union type
export const createEnum = <T extends string>(values: T[]): { [K in T]: K } => {
  return values.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, Object.create(null));
};

export function createFixedSelectAdapter<T extends string>(
  items: readonly T[]
): SelectAdapter<T> {
  return {
    getById: async (id) => items.find((item) => item === id),
    getItems: async () => [...items],
    getItemKey: (item) => item,
    renderItem: (item) => item,
  };
}

export function stopPropagation(e: React.MouseEvent) {
  return e.stopPropagation();
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export function formatToTwinfaceDate(
  dateInput: Date | string | number,
  includeTime: boolean = false
): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  return includeTime ? `${formattedDate} | ${formattedTime}` : formattedDate;
}

export function pluckProperty<
  T extends Record<string, Record<K, unknown>>,
  K extends keyof T[string],
>(obj: T, prop: K): Record<keyof T, T[string][K]> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, nestedObj]) => [key, nestedObj[prop]])
  ) as Record<keyof T, T[string][K]>;
}

export function shortenUUID(uuid: string): string {
  if (isPopulatedString(uuid) && uuid.length >= 8) {
    return `${uuid.slice(0, 8)}...${uuid.slice(-2)}`;
  }
  return uuid;
}
