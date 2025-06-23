import { ElementType } from "react";

import { Falsy } from "./misc";

//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: General Type Guards
// ──────────────────────────────────────────────────────────────────────────────
//

export function isFunction<T>(value: T): value is Extract<T, Function> {
  return typeof value === "function";
}

export function isNotFunction<T>(value: T): value is Exclude<T, Function> {
  return typeof value !== "function";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isTruthy<T>(value: T): value is Exclude<T, Falsy> {
  return Boolean(value);
}

export function isFalsy<T>(value: T | Falsy): value is Falsy {
  return !value || Number.isNaN(value as number);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isObject<T extends object>(value: unknown): value is T {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function isArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr);
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: String Utilities
// ──────────────────────────────────────────────────────────────────────────────
//

export function isEmptyString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length === 0;
}

export function isPopulatedString(str: unknown): str is string {
  return typeof str === "string" && str.trim().length > 0;
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: Array Utilities
// ──────────────────────────────────────────────────────────────────────────────
//

export function isEmptyArray(arr: unknown): arr is [] {
  return Array.isArray(arr) && arr.length === 0;
}

export function isPopulatedArray<T>(arr: unknown): arr is [T, ...T[]] {
  return Array.isArray(arr) && arr.length > 0;
}

export function isSingleElementArray<T>(arr: unknown): arr is [T] {
  return Array.isArray(arr) && arr.length === 1;
}

export function isMultiElementArray<T>(arr: unknown): arr is [T, T, ...T[]] {
  return Array.isArray(arr) && arr.length > 1;
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: Error & Exception Guards
// ──────────────────────────────────────────────────────────────────────────────
//

export function isUnauthorizedError(error: unknown): boolean {
  // TODO: Replace with a custom `UnauthorizedError` class for more robust handling.
  return error instanceof Response && error.status === 401;
}

//
// ──────────────────────────────────────────────────────────────────────────────
//   SECTION: React-Specific Guards
// ──────────────────────────────────────────────────────────────────────────────
//

/**
 * Type guard to check if a value is a valid React ElementType.
 * ElementType can be a function component or a class component.
 */
export function isElementType(value: unknown): value is ElementType {
  return (
    typeof value === "function" || (typeof value === "object" && value !== null)
  );
}
