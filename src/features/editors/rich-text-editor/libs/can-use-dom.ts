import { isBrowserRuntime } from "@/shared/libs";

export const CAN_USE_DOM: boolean =
  isBrowserRuntime() &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined";
