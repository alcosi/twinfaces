import { useCallback, useContext, useState } from "react";

import { Permission } from "@/entities/permission";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useFetchPermissionsByUserId = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPermissionsByUserId = useCallback(
    async (userId: string): Promise<Permission[] | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.user.getPermissionsByUserId({
          userId,
          query: {
            lazyRelation: false,
            showPermissionMode: "DETAILED",
            showPermission2PermissionGroupMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch permissions due to API error",
            error
          );
        }

        if (isUndefined(data.permissions)) {
          throw new Error("Response does not have permissions data", error);
        }

        if (data.permissions) {
          return data.permissions;
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchPermissionsByUserId, loading };
};
