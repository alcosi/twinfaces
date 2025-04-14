import { useCallback, useContext, useState } from "react";

import { Permission } from "@/entities/permission";
import { UserPermissionListQuery } from "@/entities/user";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useFetchUserPermissionById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPermissionUserById = useCallback(
    async ({
      userId,
      query,
    }: {
      userId: string;
      query: UserPermissionListQuery;
    }): Promise<Permission[]> => {
      setLoading(true);

      try {
        const { data, error } = await api.user.getPermissionUserById({
          userId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch user due to API error", error);
        }

        if (isUndefined(data.permissions)) {
          throw new Error("Response does not have user data", error);
        }

        return data.permissions;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchPermissionUserById, loading };
};
