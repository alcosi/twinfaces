import { type ClassValue, clsx } from "clsx";
import { ReactNode, Ref, RefAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export * from "./adapter";
export * from "./collection";
export * from "./date";
export * from "./env";
export * from "./event";
export * from "./helpers";
export * from "./mapping";
export * from "./string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode
): (props: P & RefAttributes<T>) => ReactNode {
  return forwardRef(render) as any;
}
