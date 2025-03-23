import { cookies, headers } from "next/headers";

import { RemoteConfig } from "@/shared/config";

export function getDomainIdFromHeaders(): string | undefined {
  const header = headers().get("X-Domain-Config");
  if (!header) return undefined;
  return (JSON.parse(header) as RemoteConfig)?.id;
}

export async function getAuthTokenFromHeaders(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value ?? "";
}
