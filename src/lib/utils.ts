import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { forwardRef, ReactNode, Ref, RefAttributes } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode
): (props: P & RefAttributes<T>) => ReactNode {
  return forwardRef(render) as any;
}
/* eslint-enable no-unused-vars */

export const NULLIFY_UUID_VALUE: string =
  "ffffffff-ffff-ffff-ffff-ffffffffffff";
