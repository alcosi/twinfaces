"use server";

import { cookies, headers } from "next/headers";

import { RemoteConfig } from "@/shared/config";
import { isUndefined } from "@/shared/libs";

export async function getDomainIdFromHeaders(): Promise<string | undefined> {
  const header = headers().get("X-Domain-Config");
  if (!header) return undefined;
  return (JSON.parse(header) as RemoteConfig)?.id;
}

export async function getAuthTokenFromCookies(): Promise<string> {
  const cookieStore = await cookies();

  const token = cookieStore.get("authToken")?.value;
  if (isUndefined(token)) {
    throw new Error("Missing authToken in cookies");
  }

  return token;
}
