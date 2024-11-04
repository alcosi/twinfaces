import React from "react";

type ChoiceType = "ONLY" | "ONLY_NOT" | "ANY";
type TriStateFlag = boolean | "indeterminate";

export const mapToChoice = (input?: TriStateFlag): ChoiceType => {
  if (input === "indeterminate" || input === undefined) return "ANY";

  return input ? "ONLY" : "ONLY_NOT";
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

export function isEmptyString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length === 0;
}

export function isFullString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}

export function isEmptyArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length === 0;
}

export function isFullArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}
