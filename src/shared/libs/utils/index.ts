import { type ClassValue, clsx } from "clsx";
import { ReactNode, Ref, RefAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export * from "./adapter";
export * from "./api-errors";
export * from "./array";
export * from "./check-password-strength";
export * from "./client-cookies";
export * from "./collection";
export * from "./date";
export * from "./event";
export * from "./local-storage";
export * from "./map-pattern-to-input-type";
export * from "./mapping";
export * from "./platform";
export * from "./safe";
export * from "./string";
export * from "./uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode
): (props: P & RefAttributes<T>) => ReactNode {
  return forwardRef(render as any) as any;
}

// Utility function to create an enum from a string union type
export const createEnum = <T extends string>(values: T[]): { [K in T]: K } => {
  return values.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, Object.create(null));
};
