"use server";

import { cookies } from "next/headers";

import { clearAuthPermissionCache } from "@/entities/user/server";

import { AuthUser } from "./types";

export async function setAuthUser(user?: AuthUser) {
  const store = await cookies();

  if (!user) return;

  // Auth state is changing — drop any permission snapshot cached for the
  // previous session so the next lookup fetches fresh permissions.
  clearAuthPermissionCache();

  const cookieOpts = { path: "/" };

  const mappings: Record<keyof AuthUser, string> = {
    userId: "userId",
    domainId: "domainId",
    authToken: "authToken",
    authTokenExpiresAt: "authTokenExpiresAt",
    refreshToken: "refreshToken",
    refreshTokenExpiresAt: "refreshTokenExpiresAt",
  };

  for (const key of Object.keys(mappings) as (keyof AuthUser)[]) {
    const value = user[key];
    if (value !== undefined && value !== null) {
      store.set(mappings[key], String(value), cookieOpts);
    }
  }
}

export async function clearAuthUser() {
  const store = await cookies();

  clearAuthPermissionCache();

  const authKeys = [
    "userId",
    "domainId",
    "authToken",
    "authTokenExpiresAt",
    "refreshToken",
    "refreshTokenExpiresAt",
  ];

  for (const key of authKeys) {
    store.delete(key);
  }
}
