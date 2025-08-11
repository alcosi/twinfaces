"use server";

import { cookies, headers } from "next/headers";

import { RemoteConfig } from "@/shared/config";
import { isFalsy, isUndefined } from "@/shared/libs";

export async function getDomainFromHeaders(): Promise<
  RemoteConfig | undefined
> {
  const domainConfig = (await headers()).get("X-Domain-Config");

  if (isFalsy(domainConfig)) return undefined;

  return JSON.parse(domainConfig) as RemoteConfig;
}

export async function getAuthHeaders(): Promise<{
  DomainId: string;
  AuthToken: string;
  RefreshToken: string;
  Channel: "WEB";
  currentUserId: string;
}> {
  const DomainId = await getDomainIdFromCookies();
  const AuthToken = await getAuthTokenFromCookies();
  const RefreshToken = await getRefreshTokenFromCookies();
  const currentUserId = await getUserIdFromCookies();

  if (isUndefined(currentUserId)) {
    throw new Error("Failed to resolve current user ID from auth token.");
  }

  return {
    DomainId: DomainId,
    AuthToken,
    RefreshToken,
    Channel: "WEB",
    currentUserId,
  };
}

async function getDomainIdFromCookies(): Promise<string> {
  const cookieStore = await cookies();

  const domainId = cookieStore.get("domainId")?.value;

  if (isUndefined(domainId)) {
    throw new Error("Missing domainId in cookies");
  }

  return domainId;
}

async function getAuthTokenFromCookies(): Promise<string> {
  const cookieStore = await cookies();

  const token = cookieStore.get("authToken")?.value;
  if (isUndefined(token)) {
    throw new Error("Missing authToken in cookies");
  }

  return token;
}

async function getRefreshTokenFromCookies(): Promise<string> {
  const cookieStore = await cookies();

  const token = cookieStore.get("refreshToken")?.value;
  if (isUndefined(token)) {
    throw new Error("Missing refreshToken in cookies");
  }

  return token;
}

async function getUserIdFromCookies(): Promise<string> {
  const cookieStore = await cookies();

  const userId = cookieStore.get("userId")?.value;

  if (isUndefined(userId)) {
    throw new Error("Missing userId in cookies");
  }

  return userId;
}
