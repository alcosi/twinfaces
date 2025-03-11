import { useCallback, useContext, useState } from "react";

import { hydratePermissionFromMap } from "@/entities/permission";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { Permission_DETAILED, QueryPermissionViewV1 } from "../../api";

// TODO: Apply caching-strategy after discussing with team
export const useFetchPermissionById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPermissionById = useCallback(
    async ({
      permissionId,
      query,
    }: {
      permissionId: string;
      query: QueryPermissionViewV1;
    }): Promise<Permission_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.permission.getById({
          permissionId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch permission due to API error", error);
        }

        if (isUndefined(data?.permission)) {
          throw new Error("Response does not have permission data", error);
        }

        const permission = hydratePermissionFromMap(
          data.permission,
          data.relatedObjects
        );

        return permission;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchPermissionById, loading };
};
