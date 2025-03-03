import { type ClassValue, clsx } from "clsx";
import { ReactNode, Ref, RefAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export * from "./adapter";
export * from "./client-cookies";
export * from "./collection";
export * from "./date";
export * from "./env";
export * from "./event";
export * from "./local-storage";
export * from "./mapping";
export * from "./safe";
export * from "./string";
export * from "./uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode
): (props: P & RefAttributes<T>) => ReactNode {
  return forwardRef(render) as any;
}
