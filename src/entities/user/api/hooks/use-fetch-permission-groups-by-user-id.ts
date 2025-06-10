import { useCallback, useContext, useState } from "react";

import { PermissionGroup } from "@/entities/permission-group";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useFetchPermissionGroupsByUserId = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPermissionGroupsByUserId = useCallback(
    async (userId: string): Promise<PermissionGroup[] | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.user.getPermissionGroupsByUserId({
          userId,
          query: {
            lazyRelation: false,
            showPermissionGroupMode: "DETAILED",
            showPermissionGroup2TwinClassMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission groups due to API error",
            error
          );
        }

        if (isUndefined(data.permissionGroups)) {
          throw new Error(
            "Response does not have permission groups data",
            error
          );
        }

        return data.permissionGroups;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchPermissionGroupsByUserId, loading };
};
