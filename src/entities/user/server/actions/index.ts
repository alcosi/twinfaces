import { getAuthHeaders } from "@/entities/face";
import { TwinsAPI } from "@/shared/api";
import { isFound, isUndefined } from "@/shared/libs";

export * from "./auth";

// NOTE: not used, needed in core area
export async function isGranted({
  userId,
  permission,
}: {
  userId: string;
  permission: string;
}): Promise<boolean> {
  const header = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/user/{userId}/permission/v1", {
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

  const { data } = await TwinsAPI.GET("/private/user/permission/v1", {
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
