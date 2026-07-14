import { getAuthHeaders } from "@/entities/face";
import { isFound, isPopulatedString, isUndefined } from "@/shared/libs";

import { apiFromRequest } from "./auth";

export * from "./auth";

type AuthPermissionSnapshot = {
  ids: Set<string>;
  keys: Set<string>;
};

const PERMISSIONS_TTL_MS = 60 * 1000;
const authPermissionCache = new Map<
  string,
  { expiresAt: number; snapshot: AuthPermissionSnapshot }
>();

// NOTE: Not currently used! Keep for future use in the `core-area`
export async function isGranted({
  userId,
  permission,
}: {
  userId: string;
  permission: string;
}): Promise<boolean> {
  const header = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data } = await api.GET("/private/user/{userId}/permission/v1", {
    params: {
      header,
      path: { userId },
      query: {
        lazyRelation: false,
        showPermissionMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data) || isUndefined(data.permissions)) return false;

  return isFound(data.permissions, (p) => p.id === permission);
}

async function fetchAuthPermissionSnapshot(): Promise<AuthPermissionSnapshot> {
  const header = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data, error } = await api.GET("/private/user/permission/v1", {
    params: {
      header,
      query: {
        lazyRelation: false,
        showPermissionMode: "DETAILED",
      },
    },
  });

  // NOTE: the server-side client (`createTwinsClient`) has no error middleware,
  // so a failed request resolves with `data: undefined` instead of throwing.
  // Surface it as a real error so the caller never caches a "phantom empty"
  // snapshot (which would hide granted permissions, e.g. the admin area).
  // A successful response with an empty `permissions` array is a legit
  // "no permissions" result and is kept as an empty snapshot below.
  if (error) {
    throw error;
  }

  if (isUndefined(data) || isUndefined(data.permissions)) {
    throw new Error("Failed to load auth permissions: empty response");
  }

  return {
    ids: new Set(
      data.permissions
        .map((permission) => permission.id)
        .filter((id): id is string => isPopulatedString(id))
    ),
    keys: new Set(
      data.permissions
        .map((permission) => permission.key)
        .filter((key): key is string => isPopulatedString(key))
    ),
  };
}

export async function getAuthPermissionSnapshot({
  forceRefresh = false,
}: {
  forceRefresh?: boolean;
} = {}): Promise<AuthPermissionSnapshot> {
  const { DomainId, currentUserId } = await getAuthHeaders();
  const cacheKey = `${DomainId}:${currentUserId}`;
  const now = Date.now();

  const cached = authPermissionCache.get(cacheKey);
  if (!forceRefresh && cached && cached.expiresAt > now) {
    return cached.snapshot;
  }

  try {
    const snapshot = await fetchAuthPermissionSnapshot();
    authPermissionCache.set(cacheKey, {
      snapshot,
      expiresAt: now + PERMISSIONS_TTL_MS,
    });

    return snapshot;
  } catch (error) {
    // Never cache failures: a transient error (e.g. right after login, before
    // the token is fully propagated) must not hide permissions for the whole
    // TTL. Fall back to a stale snapshot if we have one; otherwise return an
    // empty snapshot WITHOUT caching so the next request retries immediately.
    console.warn("[permissions] failed to refresh auth permissions:", error);

    if (cached) {
      return cached.snapshot;
    }

    return { ids: new Set<string>(), keys: new Set<string>() };
  }
}

/**
 * Invalidate the in-memory auth permission cache.
 *
 * Called whenever auth state changes (login / logout / domain switch) so the
 * next permission lookup fetches a fresh snapshot instead of reusing a
 * snapshot that belonged to the previous session.
 */
export function clearAuthPermissionCache(): void {
  authPermissionCache.clear();
}

export async function getAuthPermissionKeys(): Promise<string[]> {
  const snapshot = await getAuthPermissionSnapshot();
  return [...snapshot.keys];
}

export async function isAuthUserGranted({
  permission,
}: {
  permission: string;
}): Promise<boolean> {
  const snapshot = await getAuthPermissionSnapshot();
  return snapshot.ids.has(permission);
}

export async function isAuthUserGrantedByKey({
  permissionKey,
}: {
  permissionKey: string;
}): Promise<boolean> {
  const snapshot = await getAuthPermissionSnapshot();
  return snapshot.keys.has(permissionKey);
}
