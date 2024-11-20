import React from "react";
import { isBoolean } from "./types";

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
