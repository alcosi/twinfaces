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
export const toArrayOfString = <T extends { id?: string }>(
  input: T[] | string[]
): string[] => {
  if (input.every((item) => typeof item === "string")) {
    return input as string[];
  }

  return (input as T[]).map((item) => item.id || "").filter((id) => id !== "");
};

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

export function isEmptyString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length === 0;
}

export function isFullString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}
