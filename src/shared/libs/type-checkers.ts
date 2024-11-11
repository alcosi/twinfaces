import { ElementType } from "react";
import { Falsy } from "./types";

export function isFunction<T>(value: T): value is Extract<T, Function> {
  return typeof value === "function";
}

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

export function isFalsy<T>(value: T | Falsy): value is Falsy {
  return !value || Number.isNaN(value as number);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

// React-specific type-checking utility functions

/**
 * Type guard to check if a value is a valid React ElementType.
 * ElementType can be a function component or a class component.
 */
export function isElementType(value: unknown): value is ElementType {
  return (
    typeof value === "function" || (typeof value === "object" && value !== null)
  );
}
