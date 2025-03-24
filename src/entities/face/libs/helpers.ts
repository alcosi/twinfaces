"use server";

import { cookies, headers } from "next/headers";

import { RemoteConfig } from "@/shared/config";
import { isFalsy, isUndefined } from "@/shared/libs";

export async function getDomainFromHeaders(): Promise<
  RemoteConfig | undefined
> {
  const header = headers().get("X-Domain-Config");

  if (isFalsy(header)) return undefined;

  return JSON.parse(header) as RemoteConfig;
}

export async function getDomainIdFromCookies(): Promise<
  Required<RemoteConfig["id"]>
> {
  const cookieStore = await cookies();

  const domainId = cookieStore.get("domainId")?.value;
  if (isUndefined(domainId)) {
    throw new Error("Missing domainId in cookies");
  }

  return domainId;
}

export async function getAuthTokenFromCookies(): Promise<string> {
  const cookieStore = await cookies();

  const token = cookieStore.get("authToken")?.value;
  if (isUndefined(token)) {
    throw new Error("Missing authToken in cookies");
  }

  return token;
}
