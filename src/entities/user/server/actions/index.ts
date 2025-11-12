import { getAuthHeaders } from "@/entities/face";
import { isFound, isUndefined } from "@/shared/libs";

import { apiFromRequest } from "./auth";

export * from "./auth";

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

export async function isAuthUserGranted({
  permission,
}: {
  permission: string;
}): Promise<boolean> {
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

  if (isUndefined(data) || isUndefined(data.permissions)) return false;

  return isFound(data.permissions, (p) => p.id === permission);
}
