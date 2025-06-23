export const isDev = process.env.NODE_ENV === "development";

export function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}

export function isServerRuntime(): boolean {
  return typeof window === "undefined";
}
