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

  const { data } = await api.GET("/private/user/permission/v1", {
    params: {
      header,
      query: {
        lazyRelation: false,
        showPermissionMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data) || isUndefined(data.permissions)) {
    return { ids: new Set<string>(), keys: new Set<string>() };
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

  const snapshot = await fetchAuthPermissionSnapshot();
  authPermissionCache.set(cacheKey, {
    snapshot,
    expiresAt: now + PERMISSIONS_TTL_MS,
  });

  return snapshot;
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
