"use server";

import { getAuthHeaders } from "@/entities/face";
import { Permission } from "@/entities/permission";
import { UserPermissionListQuery } from "@/entities/user";
import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export async function fetchUserPermissionListById<T extends Permission[]>(
  userId: string,
  options: {
    query?: UserPermissionListQuery;
  }
): Promise<T> {
  const header = await getAuthHeaders();

  const { data, error } = await TwinsAPI.GET(
    "/private/user/{userId}/permission/v1",
    {
      params: {
        header,
        path: { userId },
        query: {
          lazyRelation: false,
          ...options.query,
        },
      },
    }
  );

  if (error) {
    throw new Error("Failed to fetch user permission", error);
  }

  if (isUndefined(data.permissions)) {
    throw new Error(`User permission with id ${userId} not found.`);
  }

  return data.permissions as T;
}
