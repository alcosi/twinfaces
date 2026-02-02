export const isDev = process.env.NODE_ENV === "development";
export const domainKey = process.env.NEXT_PUBLIC_DOMAIN_KEY;
export const domainId = process.env.NEXT_PUBLIC_DOMAIN_ID;

export function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}

export function isServerRuntime(): boolean {
  return typeof window === "undefined";
}
