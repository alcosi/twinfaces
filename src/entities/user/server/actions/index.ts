import { getAuthHeaders } from "@/entities/face";
import { TwinsAPI } from "@/shared/api";
import { isFound, isUndefined } from "@/shared/libs";

export * from "./auth";

export async function isGranted({
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
